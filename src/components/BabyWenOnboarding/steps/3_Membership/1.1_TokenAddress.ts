import { OnboardingStep, StepId } from '../../../BabyWenOnboarding';
import { FormField } from '../../../BabyWenOnboarding/components/FormInput';

const TokenAddressStep: OnboardingStep = {
  id: 'dao-token-address',
  messages: [
    {
      content: "Ok, paste me the contract address of your token"
    }
  ],
  formFields: [
    {
      id: 'tokenAddress',
      label: 'Token Contract Address',
      type: 'text',
      placeholder: 'e.g. 0x1234...5678',
      required: true,
      validator: (value: string) => {
        // Basic Ethereum address validation
        if (!/^0x[a-fA-F0-9]{40}$/.test(value)) {
          return { 
            isValid: false, 
            errorMessage: 'Please enter a valid Ethereum address (0x followed by 40 hexadecimal characters)' 
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
      
      // Save token address to context or state if needed
      // sessionStorage.setItem('tokenAddress', tokenAddress);
      
      return {
        responseMessage: `Thanks! I've registered your token at address ${tokenAddress}. Now let's set up the membership conditions.`,
        nextStep: 'dao-membership-conditions'
      };
    } catch (e) {
      return {
        responseMessage: "There was an error processing your token address. Let's continue anyway.",
        nextStep: 'dao-membership-conditions'
      };
    }
  }
};

export default TokenAddressStep; 