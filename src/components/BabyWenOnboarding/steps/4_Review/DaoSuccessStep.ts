import { OnboardingStep } from '../../../BabyWenOnboarding';

const DaoSuccessStep: OnboardingStep = {
  id: 'dao-success',
  messages: [
    {
      content: "🎉 Congratulations! Your DAO has been created successfully! 🎉\n\nYour DAO is now ready to use. You'll be redirected to your DAO dashboard in a few moments where you can:\n\n• Invite members to join your community\n• Create governance proposals\n• Manage your DAO treasury\n• Customize your DAO further"
    }
  ],
  buttonAction: {
    label: "Go to Dashboard Now",
    action: "goToDashboard",
    variant: "primary"
  },
  onResponse: (response: string) => {
    return {};
  }
};

export default DaoSuccessStep; 