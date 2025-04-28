import { OnboardingStep } from '../../../BabyWenOnboarding';
import { getRandomMessage } from '../messages';

const DaoNameStep: OnboardingStep = {
  id: 'dao-name',
  messages: [
    {
      content: getRandomMessage('dao-name')
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
        nextStep: 'dao-transaction'
      };
    } catch (e) {
      // If there's an error, just continue
      return {
        nextStep: 'dao-transaction'
      };
    }
  }
};

export default DaoNameStep; 