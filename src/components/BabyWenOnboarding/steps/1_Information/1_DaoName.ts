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
    try {
      // Parse the JSON response from the form
      const data = JSON.parse(response);
      
      // Store DAO name in sessionStorage
      if (data.daoName) {
        sessionStorage.setItem('daoName', data.daoName);
      }
      
      return {
        responseMessage: `Great! "${data.daoName}" is a perfect name for your DAO. Now let's add a description.`,
        nextStep: 'dao-description'
      };
    } catch (e) {
      // If there's an error, just continue
      return {
        responseMessage: "Let's continue with the description of your DAO.",
        nextStep: 'dao-description'
      };
    }
  }
};

export default DaoNameStep; 