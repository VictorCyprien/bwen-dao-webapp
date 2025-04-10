import { OnboardingStep } from '../../BabyWenOnboarding';

const FavoriteColorStep: OnboardingStep = {
  id: 'favorite-color',
  messages: [
    {
      content: "What's your favorite color?",
      options: ['Red', 'Blue', 'Green', 'Purple', 'Other']
    }
  ],
  onResponse: (response: string) => {
    if (response === 'Other') {
      return {
        responseMessage: "Interesting choice! I like unique colors too."
      };
    }
    
    return {
      responseMessage: `${response} is a great color! I like it too.`
    };
  }
};

export default FavoriteColorStep; 