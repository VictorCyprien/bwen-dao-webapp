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
    let responseMessage = "";
    let nextStep: StepId = 'dao-token-address'; // Default for Yes option
    
    if (response.startsWith("Yes")) {
      responseMessage = "Great! Let's use your existing token for DAO membership.";
      sessionStorage.setItem('hasExistingToken', 'true');
    } else if (response.startsWith("No")) {
      responseMessage = "No problem! We'll create a new token for your DAO.";
      sessionStorage.setItem('hasExistingToken', 'false');
      nextStep = 'dao-token-name';
    }
    
    return {
      responseMessage,
      nextStep
    };
  }
};

export default TokenExistenceStep; 