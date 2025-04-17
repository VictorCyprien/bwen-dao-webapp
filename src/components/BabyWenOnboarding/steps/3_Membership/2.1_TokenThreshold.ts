import { OnboardingStep, StepId } from '../../../BabyWenOnboarding';
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
      label: 'Token Threshold',
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
      const threshold = data.tokenThreshold;
      
      // Save token threshold to session storage
      sessionStorage.setItem('tokenThreshold', threshold);
      
      return {
        responseMessage: `Great! Members will need at least ${threshold} tokens to join your DAO. Now let's finalize your DAO setup.`,
        nextStep: 'dao-review'
      };
    } catch (e) {
      return {
        responseMessage: "There was an error processing your input. Let's continue to the confirmation page.",
        nextStep: 'dao-review'
      };
    }
  }
};

export default TokenThresholdStep; 