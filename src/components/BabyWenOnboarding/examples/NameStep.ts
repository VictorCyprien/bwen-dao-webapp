import { OnboardingStep } from '../../BabyWenOnboarding';

const NameStep: OnboardingStep = {
  id: 'name',
  messages: [
    {
      content: "DEMO TEXT INPUT: What's your name? Type your response in the text field below."
      // No options provided means it will use text input
    }
  ],
  onResponse: (response: string) => {
    return {
      responseMessage: `Nice to meet you, ${response}! This shows how the text input component works.`
    };
  }
};

export default NameStep; 