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
    try {
      // Parse the JSON response from the form
      const data = JSON.parse(response);
      
      // Store DAO description in sessionStorage
      if (data.daoDescription) {
        sessionStorage.setItem('daoDescription', data.daoDescription);
      }
      
      return {
        responseMessage: "Perfect! That gives everyone a clear picture of what your DAO is about. Now let's add a logo.",
        nextStep: 'dao-logo'
      };
    } catch (e) {
      // If there's an error, just continue
      return {
        responseMessage: "Let's continue and add a logo for your DAO.",
        nextStep: 'dao-logo'
      };
    }
  }
};

export default DaoDescriptionStep; 