import { OnboardingStep, StepId } from '../../../BabyWenOnboarding';
import { getRandomMessage } from '../messages';

// Enum for application approval options
export enum ApplicationApprovalType {
  SELECTIVE = 'selective',
  ELECTION = 'election',
  EVERYBODY = 'everybody'
}

// Mapping from display name to enum value
const applicationApprovalMapping: Record<string, ApplicationApprovalType> = {
  "Selective - Only specific members can approve applications": ApplicationApprovalType.SELECTIVE,
  "Election - An elected committee approves new members": ApplicationApprovalType.ELECTION,
  "Everybody - All existing members vote on new applications": ApplicationApprovalType.EVERYBODY
};


// Enum for application approval options
export enum ApplicationApprovalType {
  SELECTIVE = 'selective',
  ELECTION = 'election',
  EVERYBODY = 'everybody'
}

// Mapping from display name to enum value
const applicationApprovalMapping: Record<string, ApplicationApprovalType> = {
  "Selective - Only specific members can approve applications": ApplicationApprovalType.SELECTIVE,
  "Election - An elected committee approves new members": ApplicationApprovalType.ELECTION,
  "Everybody - All existing members vote on new applications": ApplicationApprovalType.EVERYBODY
};


const ApplicationApprovalStep: OnboardingStep = {
  id: 'dao-application-approval',
  messages: [
    {
      content: getRandomMessage('dao-application-approval'),
      options: [
        "Selective - Only specific members can approve applications",
        "Election - An elected committee approves new members",
        "Everybody - All existing members vote on new applications"
      ]
    }
  ],
  onResponse: (response: string) => {
    let responseMessage = "";
    let nextStep: StepId = 'dao-review';
    
    // Get the enum value from the mapping
    const applicationType = applicationApprovalMapping[response];
    
    // Store the selected approval method in sessionStorage
    sessionStorage.setItem('applicationApproval', applicationType);
    
    if (response.startsWith("Selective")) {
      responseMessage = "You've chosen to have specific members approve applications. This creates a selective curation process with focused decision-making.";
    } else if (response.startsWith("Election")) {
      responseMessage = "You've chosen to have an elected committee approve applications. This balances efficiency with community representation.";
    } else if (response.startsWith("Everybody")) {
      responseMessage = "You've chosen to have all members vote on applications. This creates the most democratic process for new member approval.";
    }
    
    responseMessage += " Now let's finalize your DAO setup.";
    
    return {
      responseMessage,
      nextStep
    };
  }
};

export default ApplicationApprovalStep; 