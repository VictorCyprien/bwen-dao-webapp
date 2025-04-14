import { OnboardingStep, StepId } from '../../../BabyWenOnboarding';

const ApplicationApprovalStep: OnboardingStep = {
  id: 'dao-application-approval',
  messages: [
    {
      content: "Who gets to approve who joins your DAO?",
      options: [
        "Selective - Only specific members can approve applications",
        "Election - An elected committee approves new members",
        "Everybody - All existing members vote on new applications"
      ]
    }
  ],
  onResponse: (response: string) => {
    let responseMessage = "";
    let nextStep: StepId = 'dao-confirmation';
    
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