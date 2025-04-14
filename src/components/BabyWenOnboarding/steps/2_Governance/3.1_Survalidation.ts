import { OnboardingStep, StepId } from '../../../BabyWenOnboarding';

const SurvalidationStep: OnboardingStep = {
  id: 'dao-survalidation',
  messages: [
    {
      content: "Is there someone who has to survalidate the decisions (giving the final \"yes\")?",
      options: [
        "Selective - Only certain members can survalidate",
        "Election - Elected committee gives final approval",
        "No survalidating - Decisions pass automatically when voted"
      ]
    }
  ],
  onResponse: (response: string) => {
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