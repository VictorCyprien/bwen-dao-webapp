import { OnboardingStep } from '../../../BabyWenOnboarding';
import { FormField } from '../../../BabyWenOnboarding/components/FormInput';
import { getRandomMessage } from '../messages';

const TokenTickerStep: OnboardingStep = {
  id: 'dao-token-ticker',
  messages: [
    {
      content: getRandomMessage('dao-token-ticker')
    }
  ],
  formFields: [
    {
      id: 'tokenTicker',
      label: 'Token Ticker Symbol',
      type: 'text',
      placeholder: 'e.g. MTK',
      required: true,
      validator: (value: string) => {
        value = value.trim().toUpperCase();
        
        // Basic ticker validation
        if (value.length < 2 || value.length > 5) {
          return { 
            isValid: false, 
            errorMessage: 'Ticker symbol must be 2-5 characters long' 
          };
        }
        
        // Check for valid characters (alphanumeric)
        if (!/^[A-Z0-9]+$/.test(value)) {
          return {
            isValid: false,
            errorMessage: 'Ticker can only contain letters and numbers'
          };
        }
        
        return { isValid: true };
      }
    }
  ],
  onResponse: (response: string) => {
    try {
      const data = JSON.parse(response);
      let tokenTicker = data.tokenTicker;
      
      // Normalize ticker to uppercase
      tokenTicker = tokenTicker.trim().toUpperCase();
      
      // Save token ticker to sessionStorage
      sessionStorage.setItem('tokenTicker', tokenTicker);
      
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

export default TokenTickerStep; 