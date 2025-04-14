import { OnboardingStep, StepId } from '../../../BabyWenOnboarding';
import { FormField } from '../../../BabyWenOnboarding/components/FormInput';

const TokenNameStep: OnboardingStep = {
  id: 'dao-token-name',
  messages: [
    {
      content: "Gotcha! Let's create the token for your DAO.\nLet's give your token a name!"
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
        if (value.trim().length < 3) {
          return {
            isValid: false,
            errorMessage: 'Token name should be at least 3 characters long'
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
      
      // Save token name to context or state if needed
      // sessionStorage.setItem('tokenName', tokenName);
      
      return {
        responseMessage: `Great! "${tokenName}" is a good name for your token. Now let's choose a ticker symbol.`,
        nextStep: 'dao-token-ticker'
      };
    } catch (e) {
      return {
        responseMessage: "There was an error processing your token name. Let's continue with the ticker anyway.",
        nextStep: 'dao-token-ticker'
      };
    }
  }
};

export default TokenNameStep; 