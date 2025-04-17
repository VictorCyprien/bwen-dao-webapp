import { OnboardingStep } from '../../../BabyWenOnboarding';
import { FormField } from '../../../BabyWenOnboarding/components/FormInput';
import { getRandomMessage } from '../messages';

const TokenThresholdStep: OnboardingStep = {
  id: 'dao-token-threshold',
  messages: [
    {
      content: getRandomMessage('dao-token-threshold')
    }
  ],
  formFields: [
    {
      id: 'tokenThreshold',
      label: 'Minimum Token Amount',
      type: 'number',
      placeholder: 'e.g. 100',
      required: true,
      validator: (value: string) => {
        const numValue = parseFloat(value);
        
        if (isNaN(numValue) || numValue <= 0) {
          return { 
            isValid: false, 
            errorMessage: 'Please enter a positive number' 
          };
        }
        
        return { isValid: true };
      }
    }
  ],
  onResponse: (response: string) => {
    try {
      const data = JSON.parse(response);
      const tokenThreshold = data.tokenThreshold;
      
      // Save token threshold to sessionStorage
      sessionStorage.setItem('tokenThreshold', tokenThreshold);
      
      return {
        nextStep: 'dao-review'
      };
    } catch (e) {
      return {
        nextStep: 'dao-review'
      };
    }
  }
};

export default TokenThresholdStep; 