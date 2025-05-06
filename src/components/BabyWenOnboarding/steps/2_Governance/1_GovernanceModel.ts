import { OnboardingStep, StepId } from '../../../BabyWenOnboarding';
import { OptionDetail } from '../../../BabyWenOnboarding/components/MultiChoiceInput';
import { getRandomMessage } from '../messages';
import { GOVERNANCE_MODELS, VotingPowerSystem } from '../../../../utils/GovernanceModelHelper';

// Define option details for each governance model
const governanceDetails: Record<string, OptionDetail> = {
  'Enlightened Dictatorship': {
    title: 'Enlightened Dictatorship',
    description: `Single leader making decisions.

Key characteristics:
• One leader with complete decision authority
• Faster decision-making
• Clear vision and direction
• No bureaucracy

Best for:
• Early-stage DAOs
• Projects with a strong visionary founder
• Situations requiring quick pivots`
  },
  'Assisted Dictatorship': {
    title: 'Assisted Dictatorship',
    description: `Leader with advisors.

Key characteristics:
• Central leader with advisory council
• Blend of quick decisions with input from advisors
• Balance of vision and diverse perspectives
• Clear leadership with accountability

Best for:
• Growing projects transitioning from single leadership
• DAOs with key stakeholders beyond the founder
• Projects balancing quick decisions with expertise`
  },
  'Hybrid Enterprise': {
    title: 'Hybrid Enterprise',
    description: `Mixed leadership with token holders.

Key characteristics:
• Centralized management with token holder input
• Professional leadership with community oversight
• Combines traditional and decentralized elements
• Structured but participatory

Best for:
• Revenue-generating DAOs
• Projects with professional operations
• Organizations transitioning to decentralization`
  },
  'Listed Company': {
    title: 'Listed Company',
    description: `Traditional company structure.

Key characteristics:
• Board of directors with elected positions
• Regular voting cycles for leadership
• Clear roles and responsibilities
• Formal governance processes

Best for:
• Larger, established DAOs
• Organizations with regulated activities
• Projects needing traditional legitimacy`
  },
  'Social Enterprise': {
    title: 'Social Enterprise',
    description: `Mission-driven organization.

Key characteristics:
• Purpose and impact-focused governance
• Stakeholder representation (not just token holders)
• Balance of mission and sustainability
• Community-driven decisions

Best for:
• Impact-focused DAOs
• Non-profit or social good initiatives
• Communities with diverse stakeholder groups`
  },
  'Association': {
    title: 'Association',
    description: `Member-based organization.

Key characteristics:
• Equal voting rights for all members
• Democratic, one-member-one-vote system
• High participation and inclusivity
• Shared ownership and responsibility

Best for:
• Community-focused DAOs
• Cooperative ventures
• Projects valuing equal representation`
  },
  'Semi-decentralized Organization': {
    title: 'Semi-decentralized Organization',
    description: `Partial decentralization.

Key characteristics:
• Working groups with delegated authority
• Progressive decentralization approach
• Balance of efficiency and participation
• Specialized teams with autonomy

Best for:
• Complex DAOs with multiple workstreams
• Organizations scaling decentralization
• Projects requiring specialized expertise`
  },
  'Decentralized Pure': {
    title: 'Decentralized Pure',
    description: `Fully decentralized governance.

Key characteristics:
• Maximum decentralization and community control
• Token-based voting without central authority
• Autonomous decision-making processes
• True collective ownership

Best for:
• Mature DAOs with active communities
• Projects with strong decentralization philosophy
• Organizations with robust on-chain capabilities`
  }
};

// Create options array with descriptions for each model
const governanceOptions = GOVERNANCE_MODELS.map(model => 
  `${model.name} - ${model.description}`
);

const GovernanceModelStep: OnboardingStep = {
  id: 'dao-governance-model',
  messages: [
    {
      content: getRandomMessage('dao-governance-model'),
      options: governanceOptions
    }
  ],
  // Pass the option details to the MultiChoiceInput component
  optionDetails: governanceDetails,
  onResponse: (response: string) => {
    // Extract the governance model name from the response
    const governanceModelName = response.split(' - ')[0];
    
    // Find the corresponding model in our GOVERNANCE_MODELS array
    const selectedModel = GOVERNANCE_MODELS.find(model => model.name === governanceModelName);
    
    if (selectedModel) {
      // Store the model ID in sessionStorage
      sessionStorage.setItem('governanceModelId', selectedModel.id.toString());
      sessionStorage.setItem('governanceModelName', selectedModel.name);
      
      // Set default values for governance that were previously set in separate steps
      // Default voting power system based on governance model
      const votingPower = (selectedModel.id <= 4) 
        ? VotingPowerSystem.TOKEN  // More traditional models use token voting
        : (selectedModel.id === 6 || selectedModel.id === 7) 
          ? VotingPowerSystem.ONE_ONE  // Association & Semi-decentralized use one-member-one-vote
          : (selectedModel.id === 8) 
            ? VotingPowerSystem.QUADRATIC  // Decentralized Pure uses quadratic voting
            : VotingPowerSystem.DEFINED;  // Social Enterprise uses reputation
            
      sessionStorage.setItem('votingPower', votingPower);
      
      // Set default quorum percentage
      sessionStorage.setItem('quorumPercentage', '51');
    }
    
    // Skip the removed governance steps and go straight to token existence
    return {
      nextStep: 'dao-token-existence' as StepId
    };
  }
};

export default GovernanceModelStep; 