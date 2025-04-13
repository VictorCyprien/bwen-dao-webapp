import { OnboardingStep } from '../../../BabyWenOnboarding';

const DaoDescriptionStep: OnboardingStep = {
  id: 'dao-description',
  messages: [
    {
      content: "Cool name! Now, what's the purpose of your DAO?\nGive me the juicy details"
    }
  ],
  formFields: [
    {
      id: 'daoDescription',
      label: 'DAO Description',
      type: 'textarea',
      placeholder: 'Describe your DAO\'s purpose and goals',
      required: true
    }
  ],
  onResponse: (response: string) => {
    // Return empty object to skip response message
    return {};
  }
};

export default DaoDescriptionStep; 