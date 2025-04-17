import { OnboardingStep, StepId } from '../../../BabyWenOnboarding';
import { getRandomMessage } from '../messages';

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
    // Store whether survalidation is enabled
    const survalidationEnabled = response.startsWith("Yes");
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