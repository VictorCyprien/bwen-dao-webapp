import { OnboardingStep } from '../../../BabyWenOnboarding';
import { getRandomMessage } from '../messages';

// Define application approval types
export enum ApplicationApprovalType {
  AUTOMATIC = 'automatic',
  EXISTING_MEMBERS = 'existing_members',
  COUNCIL = 'council'
}

// Mapping from display name to enum
const applicationApprovalMapping: Record<string, ApplicationApprovalType> = {
  "Automatic - Anyone who meets criteria is accepted": ApplicationApprovalType.AUTOMATIC,
  "Existing Members - Current members vote on applications": ApplicationApprovalType.EXISTING_MEMBERS,
  "Council - A designated group reviews applications": ApplicationApprovalType.COUNCIL
};

const ApplicationApprovalStep: OnboardingStep = {
  id: 'dao-application-approval',
  messages: [
    {
      content: getRandomMessage('dao-application-approval'),
      options: [
        "Automatic - Anyone who meets criteria is accepted",
        "Existing Members - Current members vote on applications",
        "Council - A designated group reviews applications"
      ]
    }
  ],
  onResponse: (response: string) => {
    // Get the enum value from the mapping
    const approvalType = applicationApprovalMapping[response];
    
    // Store the application approval type in sessionStorage
    sessionStorage.setItem('applicationApproval', approvalType);
    
    return {
      nextStep: 'dao-review'
    };
  }
};

export default ApplicationApprovalStep; 