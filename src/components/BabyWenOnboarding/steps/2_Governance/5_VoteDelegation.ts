import { OnboardingStep, StepId } from '../../../BabyWenOnboarding';

const VoteDelegationStep: OnboardingStep = {
  id: 'dao-vote-delegation',
  messages: [
    {
      content: "Can members hand over their vote to someone they trust?",
      options: [
        "Yes - Members can delegate their voting power",
        "No - Voting power cannot be transferred"
      ]
    }
  ],
  onResponse: (response: string) => {
    // Store whether vote delegation is enabled
    const voteDelegationEnabled = response.startsWith("Yes");
    sessionStorage.setItem('voteDelegation', voteDelegationEnabled.toString());
    
    let responseMessage = "";
    let nextStep: StepId = 'dao-token-existence'; // Go to the first membership step
    
    if (response.startsWith("Yes")) {
      responseMessage = "You've chosen to allow vote delegation. This increases participation rates and lets members contribute even when they can't actively participate in every vote.";
    } else if (response.startsWith("No")) {
      responseMessage = "You've chosen to disallow vote delegation. This ensures that only engaged members who review proposals themselves can vote, potentially leading to more informed decisions.";
    }
    
    return {
      responseMessage,
      nextStep
    };
  }
};

export default VoteDelegationStep; 