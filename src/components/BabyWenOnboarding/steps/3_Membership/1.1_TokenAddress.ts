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