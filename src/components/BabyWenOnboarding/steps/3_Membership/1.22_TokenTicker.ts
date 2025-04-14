import { OnboardingStep, StepId } from '../../../BabyWenOnboarding';
import { FormField } from '../../../BabyWenOnboarding/components/FormInput';

const TokenTickerStep: OnboardingStep = {
  id: 'dao-token-ticker',
  messages: [
    {
      content: "Time to pick a ticker!\nKeep it short and snappy."
    }
  ],
  formFields: [
    {
      id: 'tokenTicker',
      label: 'Token Ticker',
      type: 'text',
      placeholder: 'e.g. MDT',
      required: true,
      validator: (value: string) => {
        if (value.trim().length < 2 || value.trim().length > 6) {
          return {
            isValid: false,
            errorMessage: 'Ticker should be between 2 and 6 characters'
          };
        }
        if (!/^[A-Z0-9]+$/.test(value.trim())) {
          return {
            isValid: false,
            errorMessage: 'Ticker should only contain uppercase letters and numbers'
          };
        }
        return { isValid: true };
      }
    }
  ],
  onResponse: (response: string) => {
    try {
      const data = JSON.parse(response);
      const tokenTicker = data.tokenTicker;
      
      // Save token ticker to context or state if needed
      // sessionStorage.setItem('tokenTicker', tokenTicker);
      
      return {
        responseMessage: `Perfect! Your token will use the ticker symbol "${tokenTicker}". Now let's set up membership conditions.`,
        nextStep: 'dao-membership-conditions'
      };
    } catch (e) {
      return {
        responseMessage: "There was an error processing your token ticker. Let's continue anyway.",
        nextStep: 'dao-membership-conditions'
      };
    }
  }
};

export default TokenTickerStep; 