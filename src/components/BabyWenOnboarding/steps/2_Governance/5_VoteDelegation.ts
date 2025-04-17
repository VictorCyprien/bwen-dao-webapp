import { OnboardingStep } from '../../../BabyWenOnboarding';
import { getRandomMessage } from '../messages';

const VoteDelegationStep: OnboardingStep = {
  id: 'dao-vote-delegation',
  messages: [
    {
      content: getRandomMessage('dao-vote-delegation'),
      options: [
        "Yes - Allow members to delegate their votes",
        "No - Each member must vote directly"
      ]
    }
  ],
  onResponse: (response: string) => {
    // Store the vote delegation preference
    const allowDelegation = response.startsWith("Yes");
    sessionStorage.setItem('voteDelegation', allowDelegation.toString());
    
    return {
      nextStep: 'dao-token-existence'
    };
  }
};

export default VoteDelegationStep; 