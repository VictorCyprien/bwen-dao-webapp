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
    // Return empty object to skip response message
    return {};
  }
};

export default DaoLogoStep; 