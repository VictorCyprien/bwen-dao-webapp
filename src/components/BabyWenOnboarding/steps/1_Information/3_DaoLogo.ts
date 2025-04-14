import { OnboardingStep } from '../../../BabyWenOnboarding';

const DaoLogoStep: OnboardingStep = {
  id: 'dao-logo',
  messages: [
    {
      content: "Let's make your DAO look professional! Enter the URL of your DAO's logo."
    }
  ],
  formFields: [
    {
      id: 'daoLogo',
      label: 'DAO Logo URL',
      type: 'text',
      placeholder: 'Enter the URL of your DAO logo (recommended size: 512x512px)',
      required: true
    }
  ],
  onResponse: (response: string) => {
    try {
      const data = JSON.parse(response);
      
      // Store the logo info in sessionStorage if available
      if (data.daoLogo) {
        // In a real app, the file would be uploaded to a server
        // and we'd store the URL. For now, just store that it was uploaded
        sessionStorage.setItem('daoLogo', 'logo_uploaded');
      }
      
      return {
        responseMessage: "Perfect! Your logo looks great. Now let's add some social links for your DAO.",
        nextStep: 'dao-social'
      };
    } catch (e) {
      // If there was an error, continue anyway
      return {
        responseMessage: "Let's continue and add some social links for your DAO.",
        nextStep: 'dao-social'
      };
    }
  }
};

export default DaoLogoStep; 