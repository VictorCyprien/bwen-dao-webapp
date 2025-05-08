import { OnboardingStep } from '../../../BabyWenOnboarding';
import { getGovernanceModelById } from '../../../../utils/GovernanceModelHelper';

const DaoReviewStep: OnboardingStep = {
  id: 'dao-review',
  messages: [
    {
      content: "Great job! Let's review all the information you've provided for your DAO. Your blockchain transaction was already processed at the beginning, so now we just need to finalize your DAO setup with the details below :"
    }
  ],
  buttonAction: {
    label: 'Complete DAO Setup',
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
  const governanceModelId = parseInt(sessionStorage.getItem('governanceModelId') || '1', 10);
  const governanceModelDetails = getGovernanceModelById(governanceModelId);
  const quorumPercentage = sessionStorage.getItem('quorumPercentage') || '51';
  const votingPower = sessionStorage.getItem('votingPower') || 'Token';
  
  const governanceInfo = {
    governanceModel: governanceModelDetails?.name || 'Not specified',
    governanceModelId: governanceModelId,
    votingPower: votingPower,
    quorumPercentage: quorumPercentage
  };

  return {
    daoInfo,
    tokenInfo,
    membershipInfo,
    governanceInfo
  };
};

export default DaoReviewStep; 