import { OnboardingStep, StepId } from '../../../BabyWenOnboarding';

const MembershipConditionsStep: OnboardingStep = {
  id: 'dao-membership-conditions',
  messages: [
    {
      content: "Alright, let's set the stage for your new members!\nWhat are the conditions for someone to join your DAO?",
      options: [
        "Token Based - Members need to hold a certain amount of tokens",
        "Free (1 Token) - Anyone can join with minimal token ownership",
        "Application - New members must apply and be approved"
      ]
    }
  ],
  onResponse: (response: string) => {
    let responseMessage = "";
    let nextStep: StepId = 'dao-confirmation'; // Default next step for Free option
    
    if (response.startsWith("Token Based")) {
      responseMessage = "You've chosen a token threshold model. This creates value for your token and ensures members have skin in the game.";
      nextStep = 'dao-token-threshold'; // Go to token threshold input
    } else if (response.startsWith("Free")) {
      responseMessage = "You've chosen a minimal token requirement. This creates an open DAO that's easy to join while still requiring some basic commitment.";
      // Keep default nextStep (confirmation)
    } else if (response.startsWith("Application")) {
      responseMessage = "You've chosen an application process. This gives you more control over membership and creates a more curated community.";
      nextStep = 'dao-application-approval'; // Go to application approval selection
    }
    
    // Add a closing message
    responseMessage += " Congratulations! You've completed your DAO setup. Let's go back to the beginning to review everything.";
    
    return {
      responseMessage,
      nextStep
    };
  }
};

export default MembershipConditionsStep; 