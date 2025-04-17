import { OnboardingStep, StepId } from '../../../BabyWenOnboarding';
import { getRandomMessage } from '../messages';

// Enum for vote rights options
export enum VoteRightsType {
  SELECTIVE = 'selective',
  ELECTION = 'election',
  EVERY_MEMBER = 'every_member'
}

// Mapping from display name to enum value
const voteRightsMapping: Record<string, VoteRightsType> = {
  "Selective - Only specific members can vote": VoteRightsType.SELECTIVE,
  "Election - Members elect representatives who vote": VoteRightsType.ELECTION,
  "Every Member - All members can vote on decisions": VoteRightsType.EVERY_MEMBER
};

// Enum for vote rights options
export enum VoteRightsType {
  SELECTIVE = 'selective',
  ELECTION = 'election',
  EVERY_MEMBER = 'every_member'
}

// Mapping from display name to enum value
const voteRightsMapping: Record<string, VoteRightsType> = {
  "Selective - Only specific members can vote": VoteRightsType.SELECTIVE,
  "Election - Members elect representatives who vote": VoteRightsType.ELECTION,
  "Every Member - All members can vote on decisions": VoteRightsType.EVERY_MEMBER
};

const VoteRightsStep: OnboardingStep = {
  id: 'dao-vote-rights',
  messages: [
    {
      content: getRandomMessage('dao-vote-rights'),
      options: [
        "Selective - Only specific members can vote",
        "Election - Members elect representatives who vote",
        "Every Member - All members can vote on decisions"
      ]
    }
  ],
  onResponse: (response: string) => {
    // Get the enum value from the mapping
    const voteRightsType = voteRightsMapping[response];
    
    // Store the selected vote rights in sessionStorage
    sessionStorage.setItem('voteRights', voteRightsType);
    
    let responseMessage = "";
    let nextStep: StepId = 'dao-voting-power'; // Default next step
    
    if (response.startsWith("Selective")) {
      responseMessage = "You've chosen selective voting. This approach ensures that only qualified or designated members make critical decisions, streamlining the process.";
    } else if (response.startsWith("Election")) {
      responseMessage = "You've chosen representative democracy. Members elect trusted individuals to vote on their behalf, creating an efficient governance system while maintaining indirect member influence.";
    } else if (response.startsWith("Every Member")) {
      responseMessage = "You've chosen full democratic participation. All members get a voice in decision-making, maximizing inclusivity and collective wisdom.";
      nextStep = 'dao-survalidation'; // If everyone votes, ask about survalidation
    }
    
    return {
      responseMessage,
      nextStep
    };
  }
};

export default VoteRightsStep; 