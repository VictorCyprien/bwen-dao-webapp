import { OnboardingStep } from '../../../BabyWenOnboarding';
import { getRandomMessage } from '../messages';
import DescriptionInput from '../../components/DescriptionInput';
import Replicate from "replicate";

const DaoDescriptionStep: OnboardingStep = {
  id: 'dao-description',
  messages: [
    {
      content: getRandomMessage('dao-description')
    }
  ],
  customComponent: DescriptionInput,
  onCustomComponentResponse: (option: string, data?: string) => {
    if (option === 'submit' && data) {
      // Store DAO description in sessionStorage
      sessionStorage.setItem('daoDescription', data);
      return {
        nextStep: 'dao-logo'
      };
    } else if (option === 'improve' && data) {
      // Note: Because of the interface constraints, we'll handle the API call 
      // in the DescriptionInput component and pass the result back
      // Store the AI-improved DAO description in sessionStorage
      sessionStorage.setItem('daoDescription', data);
      return {
        nextStep: 'dao-logo'
      };
    }
    
    return {
      nextStep: 'dao-logo'
    };
  },
  onResponse: (response: string) => {
    try {
      // Parse the JSON response from the form
      const data = JSON.parse(response);
      
      // Store DAO description in sessionStorage
      if (data.daoDescription) {
        sessionStorage.setItem('daoDescription', data.daoDescription);
      }
      
      return {
        nextStep: 'dao-logo'
      };
    } catch (e) {
      // If there's an error, just continue
      return {
        nextStep: 'dao-logo'
      };
    }
  }
};

export default DaoDescriptionStep; 