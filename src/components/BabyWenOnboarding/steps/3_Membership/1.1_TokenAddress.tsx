import * as React from 'react';
import { OnboardingStep } from '../../../BabyWenOnboarding';
import { getRandomMessage } from '../messages';

// Définir l'interface pour le composant TokenAddress
interface TokenPreviewProps {
  tokenAddress: string;
}

// Composant intermédiaire pour charger TokenCard de manière conditionnelle
const TokenPreview: React.FC<TokenPreviewProps> = ({ tokenAddress }) => {
  const [Component, setComponent] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [hasError, setHasError] = React.useState<boolean>(false);

  React.useEffect(() => {
    // Importer TokenCard dynamiquement au moment de l'exécution
    setIsLoading(true);
    setHasError(false);
    
    import('../../../TokenCard').then(module => {
      setComponent(() => module.default);
      
      // Vérifier après 5 secondes si des informations ont été trouvées
      const timer = setTimeout(() => {
        // On vérifie si un élément avec le texte d'erreur existe dans le DOM
        const tokenCard = document.getElementById('token-preview');
        if (tokenCard) {
          const tokenName = tokenCard.querySelector('.token-name');
          const errorText = tokenCard.querySelector('.text-red-400');
          
          if (!tokenName || errorText) {
            setHasError(true);
          }
        }
        setIsLoading(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    });
  }, [tokenAddress]);

  if (isLoading) {
    return (
      <div className="bg-[#111]/80 backdrop-blur-sm rounded-xl p-5 shadow-lg">
        <div className="flex items-center justify-center h-24">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }
  
  if (hasError) {
    return (
      <div className="bg-[#111]/80 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-red-800/40">
        <div className="flex flex-col items-center justify-center h-24 text-center">
          <p className="text-red-400 text-sm font-medium">
            This contract seems invalid, no information found
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Please verify the token address is correct and try again
          </p>
        </div>
      </div>
    );
  }

  return (
    <div id="token-preview">
      {Component && <Component tokenAddress={tokenAddress} />}
    </div>
  );
};

// Debounce helper function
const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Composant personnalisé pour afficher TokenCard et le champ d'adresse
const TokenAddressForm: React.FC<{
  onSelectOption: (option: string, data?: any) => void;
}> = ({ onSelectOption }) => {
  const [tokenAddress, setTokenAddress] = React.useState<string>('');
  const [isValid, setIsValid] = React.useState<boolean>(false);
  
  // Utiliser debounce pour n'appliquer la valeur qu'après 1s sans input
  const debouncedTokenAddress = useDebounce<string>(tokenAddress, 1000);

  // Validation de l'adresse Solana
  const validateSolanaAddress = (value: string) => {
    // Solana address validation - base58 encoded, typically 32-44 characters
    return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(value);
  };

  // Valider l'adresse à chaque changement
  React.useEffect(() => {
    setIsValid(validateSolanaAddress(tokenAddress));
  }, [tokenAddress]);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTokenAddress(value);
  };

  const handleSubmit = () => {
    if (validateSolanaAddress(tokenAddress)) {
      // Envoyer l'adresse au processus d'onboarding
      onSelectOption('submit', { tokenAddress });
    } else {
      alert('Please enter a valid Solana address');
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="space-y-3">
        <label className="block text-white text-sm font-medium">
          Token Contract Address (Solana)
        </label>
        <input
          type="text"
          className="w-full bg-[#1A1A1A] border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          placeholder="e.g. ABC123XYZ..."
          value={tokenAddress}
          onChange={handleAddressChange}
        />
        {!isValid && tokenAddress.length > 0 && (
          <p className="text-red-400 text-xs mt-1">
            Please enter a valid Solana address (32-44 characters using Base58 encoding)
          </p>
        )}
      </div>

      <div className="py-3">
        {debouncedTokenAddress && validateSolanaAddress(debouncedTokenAddress) ? (
          <TokenPreview tokenAddress={debouncedTokenAddress} />
        ) : (
          <div className="bg-[#111]/80 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-gray-800/60">
            <div className="flex flex-col items-center justify-center h-24 text-center">
              <p className="text-gray-400 text-sm">
                {tokenAddress.length > 0 
                  ? "Enter a valid Solana token address to preview token information"
                  : "Enter a Solana token address above to see token information"}
              </p>
              <p className="text-gray-500 text-xs mt-2">
                Token information will appear here after you enter a valid address
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="pt-3">
        <button
          onClick={handleSubmit}
          className="w-full px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg transition-all font-medium"
          disabled={!isValid}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

const TokenAddressStep: OnboardingStep = {
  id: 'dao-token-address',
  messages: [
    {
      content: getRandomMessage('dao-token-address')
    }
  ],
  // Utiliser le composant personnalisé au lieu des formFields
  customComponent: TokenAddressForm,
  onCustomComponentResponse: (option: string, data?: any) => {
    if (option === 'submit' && data?.tokenAddress) {
      // Save the token address in sessionStorage for later use in DAO creation
      sessionStorage.setItem('tokenAddress', data.tokenAddress);
      
      return {
        nextStep: 'dao-membership-conditions'
      };
    }
    
    return {
      nextStep: 'dao-membership-conditions'
    };
  },
  onResponse: (response: string) => {
    try {
      const data = JSON.parse(response);
      const tokenAddress = data.tokenAddress;
      
      // Save token address to sessionStorage for use in DAO creation
      sessionStorage.setItem('tokenAddress', tokenAddress);
      
      return {
        nextStep: 'dao-membership-conditions'
      };
    } catch (e) {
      return {
        nextStep: 'dao-membership-conditions'
      };
    }
  }
};

export default TokenAddressStep; 