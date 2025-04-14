import { OnboardingStep, StepId } from '../../../BabyWenOnboarding';
import { FormField } from '../../../BabyWenOnboarding/components/FormInput';

const TokenThresholdStep: OnboardingStep = {
  id: 'dao-token-threshold',
  messages: [
    {
      content: "How much token is required to enter your DAO?"
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
      
      // Save token threshold to context or state if needed
      // sessionStorage.setItem('tokenThreshold', threshold);
      
      return {
        responseMessage: `Great! Members will need at least ${threshold} tokens to join your DAO. Now let's finalize your DAO setup.`,
        nextStep: 'dao-confirmation'
      };
    } catch (e) {
      return {
        responseMessage: "There was an error processing your input. Let's continue to the confirmation page.",
        nextStep: 'dao-confirmation'
      };
    }
  }
};

export default TokenThresholdStep; 