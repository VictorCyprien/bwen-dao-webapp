import { OnboardingStep } from '../../../BabyWenOnboarding';
import { FormField } from '../../../BabyWenOnboarding/components/FormInput';
import { getRandomMessage } from '../messages';

const TokenNameStep: OnboardingStep = {
  id: 'dao-token-name',
  messages: [
    {
      content: getRandomMessage('dao-token-name')
    }
  ],
  formFields: [
    {
      id: 'tokenName',
      label: 'Token Name',
      type: 'text',
      placeholder: 'e.g. MyDAO Token',
      required: true,
      validator: (value: string) => {
        if (value.length < 3) {
          return { 
            isValid: false, 
            errorMessage: 'Token name must be at least 3 characters long' 
          };
        }
        
        return { isValid: true };
      }
    }
  ],
  onResponse: (response: string) => {
    try {
      const data = JSON.parse(response);
      const tokenName = data.tokenName;
      
      // Save token name to sessionStorage
      sessionStorage.setItem('tokenName', tokenName);
      
      return {
        nextStep: 'dao-token-ticker'
      };
    } catch (e) {
      return {
        nextStep: 'dao-token-ticker'
      };
    }
  }
};

export default TokenNameStep; 