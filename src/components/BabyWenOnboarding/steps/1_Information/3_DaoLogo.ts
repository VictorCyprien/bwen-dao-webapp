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