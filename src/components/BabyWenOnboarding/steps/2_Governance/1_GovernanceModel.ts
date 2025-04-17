import { OnboardingStep, StepId } from '../../../BabyWenOnboarding';
import { OptionDetail } from '../../../BabyWenOnboarding/components/MultiChoiceInput';
import { getRandomMessage } from '../messages';

// Enum for governance model types
export enum GovernanceModelType {
  TOKEN_VOTE = 'token_vote',
  MULTISIG = 'multisig',
  REPUTATION = 'reputation',
  QUADRATIC = 'quadratic',
  CUSTOM = 'custom'
}

// Mapping from display name to enum value
const governanceModelMapping: Record<string, GovernanceModelType> = {
  'Token Vote': GovernanceModelType.TOKEN_VOTE,
  'Multisig': GovernanceModelType.MULTISIG,
  'Reputation': GovernanceModelType.REPUTATION,
  'Quadratic': GovernanceModelType.QUADRATIC,
  'Custom': GovernanceModelType.CUSTOM
};

// Detailed information for each governance model
const governanceDetails: Record<string, OptionDetail> = {
  'Token Vote': {
    title: 'Token-based Voting',
    description: `Token-based voting is the most common governance model where 1 token equals 1 vote.

Key characteristics:
• Decision power is proportional to token holdings
• Simple to understand and implement
• Creates incentives for token acquisition
• Favors larger token holders

Best for:
• Traditional DAOs with broad token distribution
• Projects with active token markets
• DAOs focused on financial decisions`
  },
  'Multisig': {
    title: 'Multi-signature Governance',
    description: `Multi-signature (multisig) governance requires multiple trusted parties to approve decisions.

Key characteristics:
• Decisions require M-of-N signatures to execute
• High security for treasury management
• No token required to start
• Typically used by smaller, trusted groups

Best for:
• Early-stage DAOs
• DAOs with significant treasury assets
• Organizations requiring careful controls`
  },
  'Reputation': {
    title: 'Reputation-based Governance',
    description: `Reputation-based systems assign voting power based on contributions and participation.

Key characteristics:
• Voting power earned through work and participation
• Non-transferable (unlike tokens)
• Rewards long-term contribution
• Can be algorithmically determined

Best for:
• Work-focused DAOs
• Communities with contributor focus
• Projects wanting to avoid plutocracy`
  },
  'Quadratic': {
    title: 'Quadratic Voting',
    description: `Quadratic voting makes each additional vote more "expensive" to limit the power of large token holders.

Key characteristics:
• Voting cost increases quadratically with voting power
• Balances influence between large and small holders
• Helps prevent whale dominance
• More technically complex to implement

Best for:
• DAOs with uneven token distribution
• Communities focused on fairness
• Projects wanting more democratic outcomes`
  }
  // Custom option has no detailed info
};

const GovernanceModelStep: OnboardingStep = {
  id: 'dao-governance-model',
  messages: [
    {
      content: getRandomMessage('dao-governance-model'),
      options: [
        "Token Vote - Traditional token-weighted voting where 1 token equals 1 vote",
        "Multisig - A council of trusted members makes decisions by multiple signatures",
        "Reputation - Voting power based on reputation and contribution history",
        "Quadratic - Voting power scales with square root of tokens to balance influence",
        "Custom - I want to design my own governance model"
      ]
    }
  ],
  // Pass the option details to the MultiChoiceInput component
  optionDetails: governanceDetails,
  onResponse: (response: string) => {
    // Extract the governance model type from the response
    const governanceDisplay = response.split(' - ')[0];
    const governanceType = governanceModelMapping[governanceDisplay];
    
    // Store the enum value in sessionStorage
    sessionStorage.setItem('governanceModel', governanceType);
    
    // Determine the next step
    let nextStep: StepId = 'dao-token-existence'; // Templates go straight to token/membership
    
    if (governanceDisplay === "Custom") {
      nextStep = 'dao-idea-rights'; // Custom option goes to the idea rights step
    }
    
    return {
      nextStep
    };
  }
};

export default GovernanceModelStep; 