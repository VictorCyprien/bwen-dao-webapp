import { OnboardingStep, StepId } from '../../../BabyWenOnboarding';
import { getRandomMessage } from '../messages';

const TokenExistenceStep: OnboardingStep = {
  id: 'dao-token-existence',
  messages: [
    {
      content: getRandomMessage('dao-token-existence'),
      options: [
        "Yes - I already have a token",
        "No - Let's create one"
      ]
    }
  ],
  onResponse: (response: string) => {
    let nextStep: StepId = 'dao-token-address'; // Default for Yes option
    
    if (response.startsWith("Yes")) {
      sessionStorage.setItem('hasExistingToken', 'true');
    } else if (response.startsWith("No")) {
      sessionStorage.setItem('hasExistingToken', 'false');
      nextStep = 'dao-token-name';
    }
    
    return {
      nextStep
    };
  }
};

export default TokenExistenceStep; 