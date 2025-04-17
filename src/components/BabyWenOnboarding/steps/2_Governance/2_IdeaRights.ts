import { OnboardingStep, StepId } from '../../../BabyWenOnboarding';
import { getRandomMessage } from '../messages';

// Enum for idea rights options
export enum IdeaRightsType {
  SELECTIVE = 'selective',
  ELECTION = 'election',
  EVERY_MEMBER = 'every_member'
}

// Mapping from display name to enum value
const ideaRightsMapping: Record<string, IdeaRightsType> = {
  "Selective - Only certain members can propose ideas": IdeaRightsType.SELECTIVE,
  "Election - Members elected to a proposal committee": IdeaRightsType.ELECTION,
  "Every Member - Any member can propose ideas": IdeaRightsType.EVERY_MEMBER
};

// Enum for idea rights options
export enum IdeaRightsType {
  SELECTIVE = 'selective',
  ELECTION = 'election',
  EVERY_MEMBER = 'every_member'
}

// Mapping from display name to enum value
const ideaRightsMapping: Record<string, IdeaRightsType> = {
  "Selective - Only certain members can propose ideas": IdeaRightsType.SELECTIVE,
  "Election - Members elected to a proposal committee": IdeaRightsType.ELECTION,
  "Every Member - Any member can propose ideas": IdeaRightsType.EVERY_MEMBER
};

const IdeaRightsStep: OnboardingStep = {
  id: 'dao-idea-rights',
  messages: [
    {
      content: getRandomMessage('dao-idea-rights'),
      options: [
        "Selective - Only certain members can propose ideas",
        "Election - Members elected to a proposal committee",
        "Every Member - Any member can propose ideas"
      ]
    }
  ],
  onResponse: (response: string) => {
    // Get the enum value from the mapping
    const ideaRightsType = ideaRightsMapping[response];
    
    // Store the selected idea rights in sessionStorage
    sessionStorage.setItem('ideaRights', ideaRightsType);
    
    let responseMessage = "";
    let nextStep: StepId = 'dao-vote-rights'; // After answering this, go to the voting rights step
    
    if (response.startsWith("Selective")) {
      responseMessage = "Vous avez choisi de limiter les propositions à certains membres spécifiques. Cela peut aider à maintenir une haute qualité de propositions.";
    } else if (response.startsWith("Election")) {
      responseMessage = "Vous avez choisi d'établir un comité élu pour les propositions. C'est un bon équilibre entre ouverture et contrôle.";
    } else if (response.startsWith("Every Member")) {
      responseMessage = "Vous avez choisi de permettre à tous les membres de faire des propositions. C'est l'approche la plus démocratique et participative.";
    }
    
    return {
      responseMessage,
      nextStep
    };
  }
};

export default IdeaRightsStep; 