import { OnboardingStep } from '../../../BabyWenOnboarding';
import { getRandomMessage } from '../messages';
import LogoButtonSelect from '../../components/LogoButtonSelect';

const DaoLogoStep: OnboardingStep = {
  id: 'dao-logo',
  messages: [
    {
      content: getRandomMessage('dao-logo')
    }
  ],
  customComponent: LogoButtonSelect,
  onCustomComponentResponse: (option: string, data?: File | string) => {
    console.log(`Logo selection: ${option}`);
    
    // Store the logo data depending on the option
    if (option === 'generate' && typeof data === 'string') {
      // For generated logos, store the URL
      sessionStorage.setItem('daoLogoUrl', data);
    } else if (option === 'upload' && data instanceof File) {
      // For uploaded logos, the file is already stored by the component
      console.log(`Logo file: ${(data as File).name}`);
    }
    
    // Always return the next step regardless of the option chosen
    return {
      nextStep: 'dao-social'
    };
  },
  onResponse: (response: string) => {
    // This handles the case when user manually navigates back from a later step
    return {
      nextStep: 'dao-social'
    };
  }
};

export default DaoLogoStep; 