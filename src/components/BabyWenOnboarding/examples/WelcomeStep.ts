import { OnboardingStep } from '../../BabyWenOnboarding';

const WelcomeStep: OnboardingStep = {
  id: 'welcome',
  messages: [
    {
      content: "DEMO MULTI-CHOICE: I'm BabyWen, your AI assistant. How are you doing today?",
      options: ['I\'m doing great!', 'I\'m okay, thanks for asking']
    }
  ],
  onResponse: (response: string) => {
    // No matter what the user responds, provide a nice follow-up
    return {
      responseMessage: "That's good to hear! This is a demonstration of multiple choice response buttons."
    };
  }
};

export default WelcomeStep; 