import { OnboardingStep, StepId } from '../../../BabyWenOnboarding';
import { getRandomMessage } from '../messages';

// Enum for membership conditions options
export enum MembershipConditionsType {
  TOKEN_BASED = 'token_based',
  FREE = 'free',
  APPLICATION = 'application'
}

// Mapping from display name to enum value
const membershipConditionsMapping: Record<string, MembershipConditionsType> = {
  "Token Based - Members need to hold a certain amount of tokens": MembershipConditionsType.TOKEN_BASED,
  "Free (1 Token) - Anyone can join with minimal token ownership": MembershipConditionsType.FREE,
  "Application - New members must apply and be approved": MembershipConditionsType.APPLICATION
};

// Enum for membership conditions options
export enum MembershipConditionsType {
  TOKEN_BASED = 'token_based',
  FREE = 'free',
  APPLICATION = 'application'
}

// Mapping from display name to enum value
const membershipConditionsMapping: Record<string, MembershipConditionsType> = {
  "Token Based - Members need to hold a certain amount of tokens": MembershipConditionsType.TOKEN_BASED,
  "Free (1 Token) - Anyone can join with minimal token ownership": MembershipConditionsType.FREE,
  "Application - New members must apply and be approved": MembershipConditionsType.APPLICATION
};

const MembershipConditionsStep: OnboardingStep = {
  id: 'dao-membership-conditions',
  messages: [
    {
      content: getRandomMessage('dao-membership-conditions'),
      options: [
        "Token Based - Members need to hold a certain amount of tokens",
        "Free (1 Token) - Anyone can join with minimal token ownership",
        "Application - New members must apply and be approved"
      ]
    }
  ],
  onResponse: (response: string) => {
    let responseMessage = "";
    let nextStep: StepId = 'dao-review'; // Default next step for Free option
    
    // Get the enum value from the mapping
    const membershipConditionsType = membershipConditionsMapping[response];
    
    // Store the selected membership condition in sessionStorage
    sessionStorage.setItem('membershipConditions', membershipConditionsType);
    
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