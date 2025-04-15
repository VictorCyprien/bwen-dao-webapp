import { OnboardingStep, StepId } from '../../../BabyWenOnboarding';

const VotingPowerStep: OnboardingStep = {
  id: 'dao-voting-power',
  messages: [
    {
      content: "Alright, let's talk power!\nHow do you want to distribute voting power in your DAO?",
      options: [
        "Token Based - Voting power proportional to tokens held",
        "1 Member 1 Vote - Equal voting power for all members",
        "Quadratic - Voting power increases as square root of tokens",
        "Defined Power - Manually assigned voting weights"
      ]
    }
  ],
  onResponse: (response: string) => {
    // Store the selected voting power mechanism
    sessionStorage.setItem('votingPower', response);
    
    let responseMessage = "";
    let nextStep: StepId = 'dao-vote-delegation'; // Go to the vote delegation step
    
    if (response.startsWith("Token Based")) {
      responseMessage = "You've chosen token-based voting power. This creates incentives for token acquisition and gives larger stakeholders more influence over decisions.";
    } else if (response.startsWith("1 Member 1 Vote")) {
      responseMessage = "You've chosen equal voting power for all members. This is the most democratic approach, ensuring every voice has the same weight regardless of token holdings.";
    } else if (response.startsWith("Quadratic")) {
      responseMessage = "You've chosen quadratic voting. This balances influence by making each additional vote more 'expensive', preventing any single entity from having too much control.";
    } else if (response.startsWith("Defined Power")) {
      responseMessage = "You've chosen manually defined voting power. This gives you complete control over the voting weight of each member, allowing for customized governance structures.";
    }
    
    return {
      responseMessage,
      nextStep
    };
  }
};

export default VotingPowerStep; 