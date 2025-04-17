import { OnboardingStep, StepId } from '../../../BabyWenOnboarding';
import { getRandomMessage } from '../messages';

// Enum for voting power options
export enum VotingPowerType {
  EQUAL = 'equal',
  TOKEN_BASED = 'token_based',
  QUADRATIC = 'quadratic',
  REPUTATION = 'reputation'
}

// Mapping from display name to enum value
const votingPowerMapping: Record<string, VotingPowerType> = {
  "Equal - One member, one vote": VotingPowerType.EQUAL,
  "Token-Based - Voting power proportional to tokens held": VotingPowerType.TOKEN_BASED,
  "Quadratic - Square root of tokens (reduces whale power)": VotingPowerType.QUADRATIC,
  "Reputation-Based - Voting power based on contributions": VotingPowerType.REPUTATION
};

const VotingPowerStep: OnboardingStep = {
  id: 'dao-voting-power',
  messages: [
    {
      content: getRandomMessage('dao-voting-power'),
      options: [
        "Equal - One member, one vote",
        "Token-Based - Voting power proportional to tokens held",
        "Quadratic - Square root of tokens (reduces whale power)",
        "Reputation-Based - Voting power based on contributions"
      ]
    }
  ],
  onResponse: (response: string) => {
    // Get the enum value from the mapping
    const votingPowerType = votingPowerMapping[response];
    
    // Store the voting power type in sessionStorage
    sessionStorage.setItem('votingPower', votingPowerType);
    
    return {
      nextStep: 'dao-vote-delegation'
    };
  }
};

export default VotingPowerStep; 