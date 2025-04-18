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
    // No need for response message, just proceed
    return {};
  }
};

// Function to retrieve and format all DAO information from sessionStorage
export const getDAOReviewData = () => {
  // Basic information
  const daoInfo = {
    name: sessionStorage.getItem('daoName') || 'Not specified',
    description: sessionStorage.getItem('daoDescription') || 'Not specified',
    logo: sessionStorage.getItem('daoLogo') || null,
    logoType: sessionStorage.getItem('daoLogoType') || null,
    logoUrl: sessionStorage.getItem('daoLogoUrl') || null,
    socials: {
      twitter: sessionStorage.getItem('daoTwitter') || undefined,
      discord: sessionStorage.getItem('daoDiscord') || undefined,
      website: sessionStorage.getItem('daoWebsite') || undefined,
      telegram: sessionStorage.getItem('daoTelegram') || undefined,
      instagram: sessionStorage.getItem('daoInstagram') || undefined,
      tiktok: sessionStorage.getItem('daoTiktok') || undefined,
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
    applicationApproval: sessionStorage.getItem('applicationApproval') || 'Not specified'
  };

  // Governance information
  const governanceInfo = {
    governanceModel: sessionStorage.getItem('governanceModel') || 'Not specified',
    ideaRights: sessionStorage.getItem('ideaRights') || 'Not specified',
    voteRights: sessionStorage.getItem('voteRights') || 'Not specified',
    survalidation: sessionStorage.getItem('survalidation') || 'false',
    survalidationType: sessionStorage.getItem('survalidationType') || 'Not specified',
    votingPower: sessionStorage.getItem('votingPower') || 'Not specified',
    voteDelegation: sessionStorage.getItem('voteDelegation') || 'false'
  };

  return {
    daoInfo,
    tokenInfo,
    membershipInfo,
    governanceInfo
  };
};

export default DaoReviewStep; 