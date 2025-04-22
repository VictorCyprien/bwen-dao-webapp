import { OnboardingStep, StepId } from '../../../BabyWenOnboarding';
import { FormField } from '../../../BabyWenOnboarding/components/FormInput';
import { getRandomMessage } from '../messages';

const TokenAddressStep: OnboardingStep = {
  id: 'dao-token-address',
  messages: [
    {
      content: getRandomMessage('dao-token-address')
    }
  ],
  formFields: [
    {
      id: 'tokenAddress',
      label: 'Token Contract Address (Solana)',
      type: 'text',
      placeholder: 'e.g. ABC123XYZ...',
      required: true,
      validator: (value: string) => {
        // Solana address validation - base58 encoded, typically 32-44 characters
        if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(value)) {
          return { 
            isValid: false, 
            errorMessage: 'Please enter a valid Solana address (32-44 characters using Base58 encoding)' 
          };
        }
        return { isValid: true };
      }
    }
  ],
  onResponse: (response: string) => {
    try {
      const data = JSON.parse(response);
      const tokenAddress = data.tokenAddress;
      
      // Save token address to sessionStorage
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