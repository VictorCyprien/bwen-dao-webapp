import { OnboardingStep } from '../../../BabyWenOnboarding';

const DaoReviewStep: OnboardingStep = {
  id: 'dao-review',
  messages: [
    {
      content: "Great job! Let's review all the information you've provided for your DAO before we create it:"
    }
  ],
  buttonAction: {
    label: 'Create DAO',
    action: 'createDao',
    variant: 'primary'
  },
  onResponse: (response: string) => {
    // When the user clicks "Create DAO", we'll show a confirmation message
    return {
      responseMessage: "Amazing! I'm creating your DAO now. This will only take a moment..."
    };
  }
};

// Function to retrieve and format all DAO information from sessionStorage
export const getDAOReviewData = () => {
  // Basic information
  const daoInfo = {
    name: sessionStorage.getItem('daoName') || 'Not specified',
    description: sessionStorage.getItem('daoDescription') || 'Not specified',
    logo: sessionStorage.getItem('daoLogo') || null,
    socials: {
      twitter: sessionStorage.getItem('daoTwitter') || 'Not specified',
      discord: sessionStorage.getItem('daoDiscord') || 'Not specified',
      website: sessionStorage.getItem('daoWebsite') || 'Not specified'
    }
  };

  // Token information
  const tokenInfo = {
    hasExistingToken: sessionStorage.getItem('hasExistingToken') === 'true',
    tokenAddress: sessionStorage.getItem('tokenAddress') || 'Not specified',
    tokenName: sessionStorage.getItem('tokenName') || 'Not specified',
    tokenTicker: sessionStorage.getItem('tokenTicker') || 'Not specified'
  };

  // Membership information
  const membershipInfo = {
    membershipConditions: sessionStorage.getItem('membershipConditions') || 'Not specified',
    tokenThreshold: sessionStorage.getItem('tokenThreshold') || 'Not specified',
    applicationApproval: sessionStorage.getItem('applicationApproval') === 'true'
  };

  // Governance information
  const governanceInfo = {
    governanceModel: sessionStorage.getItem('governanceModel') || 'Not specified',
    ideaRights: sessionStorage.getItem('ideaRights') || 'Not specified',
    voteRights: sessionStorage.getItem('voteRights') || 'Not specified',
    survalidation: sessionStorage.getItem('survalidation') === 'true',
    votingPower: sessionStorage.getItem('votingPower') || 'Not specified',
    voteDelegation: sessionStorage.getItem('voteDelegation') === 'true'
  };

  return {
    daoInfo,
    tokenInfo,
    membershipInfo,
    governanceInfo
  };
};

export default DaoReviewStep; 