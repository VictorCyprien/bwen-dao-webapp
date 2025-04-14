import { OnboardingStep } from '../../../BabyWenOnboarding';

const DaoNameStep: OnboardingStep = {
  id: 'dao-name',
  messages: [
    {
      content: "Helloooo! BabyWen here! Ready to help you build your DAO!\nFirst mission: pick a name!"
    }
  ],
  formFields: [
    {
      id: 'daoName',
      label: 'DAO Name',
      type: 'text',
      placeholder: 'Enter your DAO name',
      required: true
    }
  ],
  onResponse: (response: string) => {
    // Return empty object to skip response message
    return {};
  }
};

export default DaoNameStep; 