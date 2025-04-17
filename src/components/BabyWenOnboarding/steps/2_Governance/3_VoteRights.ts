import { OnboardingStep, StepId } from '../../../BabyWenOnboarding';
import { getRandomMessage } from '../messages';

// Enum for vote rights options
export enum VoteRightsType {
  TOKEN_HOLDERS = 'token_holders',
  SPECIAL_MEMBERS = 'special_members',
  ALL_MEMBERS = 'all_members'
}

// Mapping from display name to enum value
const voteRightsMapping: Record<string, VoteRightsType> = {
  "Token Holders - Only members with tokens can vote": VoteRightsType.TOKEN_HOLDERS,
  "Special Members - Only members with specific roles": VoteRightsType.SPECIAL_MEMBERS,
  "All Members - Every DAO member can vote": VoteRightsType.ALL_MEMBERS
};

const VoteRightsStep: OnboardingStep = {
  id: 'dao-vote-rights',
  messages: [
    {
      content: getRandomMessage('dao-vote-rights'),
      options: [
        "Token Holders - Only members with tokens can vote",
        "Special Members - Only members with specific roles",
        "All Members - Every DAO member can vote"
      ]
    }
  ],
  onResponse: (response: string) => {
    // Get the enum value from the mapping
    const voteRightsType = voteRightsMapping[response];
    
    // Store the vote rights type in sessionStorage
    sessionStorage.setItem('voteRights', voteRightsType);
    
    return {
      nextStep: 'dao-survalidation' // Go to survalidation step
    };
  }
};

export default VoteRightsStep; 