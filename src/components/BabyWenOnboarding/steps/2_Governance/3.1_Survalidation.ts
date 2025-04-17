import { OnboardingStep, StepId } from '../../../BabyWenOnboarding';
import { getRandomMessage } from '../messages';

// Define survalidation options
export enum SurvalidationType {
  NONE = 'none',
  MEMBER_COMMITTEE = 'member_committee',
  FOUNDING_TEAM = 'founding_team',
  DELEGATED = 'delegated'
}

// Mapping from display name to enum value
const survalidationMapping: Record<string, SurvalidationType> = {
  "No Survalidation - All decisions are valid after voting": SurvalidationType.NONE,
  "Member Committee - A group of elected members": SurvalidationType.MEMBER_COMMITTEE, 
  "Founding Team - Original creators of the DAO": SurvalidationType.FOUNDING_TEAM,
  "Delegated - Members with delegation powers": SurvalidationType.DELEGATED,
};

const SurvalidationStep: OnboardingStep = {
  id: 'dao-survalidation',
  messages: [
    {
      content: getRandomMessage('dao-survalidation'),
      options: [
        "No Survalidation - All decisions are valid after voting",
        "Member Committee - A group of elected members",
        "Founding Team - Original creators of the DAO",
        "Delegated - Members with delegation powers"
      ]
    }
  ],
  onResponse: (response: string) => {
    // Get the corresponding enum value
    const survalidationType = survalidationMapping[response];
    
    // Store the survalidation decision in sessionStorage
    sessionStorage.setItem('survalidation', survalidationType !== SurvalidationType.NONE ? 'true' : 'false');
    sessionStorage.setItem('survalidationType', survalidationType);
    
    // Move to the next step in the onboarding process
    return {
      nextStep: 'dao-voting-power'
    };
  }
};

export default SurvalidationStep; 