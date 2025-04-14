import { OnboardingStep } from '../../BabyWenOnboarding';

const ButtonStep: OnboardingStep = {
  id: 'button',
  messages: [
    {
      content: "Click the button below to see a special message!"
    }
  ],
  buttonAction: {
    label: "Show Message",
    action: "showAlert", // This will be handled in the main component
    variant: "primary"
  },
  onResponse: (response: string) => {
    return {
      responseMessage: "That was fun! Now let's continue with our journey."
    };
  }
};

export default ButtonStep; 