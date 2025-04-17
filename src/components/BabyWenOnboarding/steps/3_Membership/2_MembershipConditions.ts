import { OnboardingStep, StepId } from '../../../BabyWenOnboarding';
import { getRandomMessage } from '../messages';

// Define membership condition types
export enum MembershipConditionsType {
  TOKEN_THRESHOLD = 'token_threshold',
  INVITATION = 'invitation',
  APPLICATION = 'application',
  OPEN = 'open'
}

// Mapping from display name to enum value
const membershipConditionsMapping: Record<string, MembershipConditionsType> = {
  "Token Threshold - Hold a minimum amount of tokens": MembershipConditionsType.TOKEN_THRESHOLD,
  "Invitation Only - Existing members invite new ones": MembershipConditionsType.INVITATION,
  "Application - Anyone can apply for membership": MembershipConditionsType.APPLICATION,
  "Open - Anyone can join without restrictions": MembershipConditionsType.OPEN
};

const MembershipConditionsStep: OnboardingStep = {
  id: 'dao-membership-conditions',
  messages: [
    {
      content: getRandomMessage('dao-membership-conditions'),
      options: [
        "Token Threshold - Hold a minimum amount of tokens",
        "Invitation Only - Existing members invite new ones",
        "Application - Anyone can apply for membership",
        "Open - Anyone can join without restrictions"
      ]
    }
  ],
  onResponse: (response: string) => {
    // Get the enum value from the mapping
    const membershipType = membershipConditionsMapping[response];
    
    // Store membership type in sessionStorage
    sessionStorage.setItem('membershipConditions', membershipType);
    
    // Determine next step based on selection
    let nextStep: StepId = 'dao-review'; // Default to review
    
    if (membershipType === MembershipConditionsType.TOKEN_THRESHOLD) {
      nextStep = 'dao-token-threshold';
    } else if (membershipType === MembershipConditionsType.APPLICATION) {
      nextStep = 'dao-application-approval';
    }
    
    return {
      nextStep
    };
  }
};

export default MembershipConditionsStep; 