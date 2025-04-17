import { OnboardingStep, StepId } from '../../../BabyWenOnboarding';
import { getRandomMessage } from '../messages';

// Enum for survalidation options
export enum SurvalidationType {
  SELECTIVE = 'selective',
  ELECTION = 'election',
  NO_SURVALIDATION = 'no_survalidation'
}

// Mapping from display name to enum value
const survalidationMapping: Record<string, SurvalidationType> = {
  "Selective - Only certain members can survalidate": SurvalidationType.SELECTIVE,
  "Election - Elected committee gives final approval": SurvalidationType.ELECTION,
  "No survalidating - Decisions pass automatically when voted": SurvalidationType.NO_SURVALIDATION
};

const SurvalidationStep: OnboardingStep = {
  id: 'dao-survalidation',
  messages: [
    {
      content: getRandomMessage('dao-survalidation'),
      options: [
        "Selective - Only certain members can survalidate",
        "Election - Elected committee gives final approval",
        "No survalidating - Decisions pass automatically when voted"
      ]
    }
  ],
  onResponse: (response: string) => {
    // Get the enum value from the mapping
    const survalidationType = survalidationMapping[response];
    
    // Store the survalidation type in sessionStorage
    sessionStorage.setItem('survalidationType', survalidationType);
    
    // Store whether survalidation is enabled (true for selective and election, false for no survalidation)
    const survalidationEnabled = response !== "No survalidating - Decisions pass automatically when voted";
    sessionStorage.setItem('survalidation', survalidationEnabled.toString());
    
    let responseMessage = "";
    let nextStep: StepId = 'dao-voting-power'; // Go to voting power distribution step
    
    if (response.startsWith("Selective")) {
      responseMessage = "You've chosen to have specific members with final approval power. This creates a hierarchical structure that can provide stability and leadership.";
    } else if (response.startsWith("Election")) {
      responseMessage = "You've chosen an elected committee for final approval. This provides oversight while maintaining democratic principles.";
    } else if (response.startsWith("No survalidating")) {
      responseMessage = "You've chosen to have no additional approval. Once a vote passes, it's automatically enacted - the most direct form of governance.";
    }
    
    return {
      responseMessage,
      nextStep
    };
  }
};

export default SurvalidationStep; 