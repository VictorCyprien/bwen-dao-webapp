import React from 'react';
import { getDAOReviewData } from '../steps/4_Review/DaoReviewStep';

// Mapping from enum values to human-readable text
const humanReadableText: Record<string, string> = {
  // Governance Model
  'token_vote': 'Token Vote',
  'multisig': 'Multisig',
  'reputation': 'Reputation',
  'quadratic': 'Quadratic Voting',
  'custom': 'Custom',
  
  // Rights (used for both idea and vote rights)
  'selective': 'Selective Members Only',
  'election': 'Elected Committee',
  'every_member': 'Every Member',
  
  // Survalidation
  'no_survalidation': 'No Survalidation',
  
  // Voting Power
  'token_based': 'Token Based',
  'one_member_one_vote': '1 Member 1 Vote',
  'defined_power': 'Defined Power',
  
  // Membership Conditions
  'free': 'Free (1 Token)',
  'invitation': 'Invitation',
  'token_threshold': 'Token Threshold',
  'application': 'Application',
  
  // Application Approval
  'everybody': 'All Members Vote',
  'automatic': 'Automatic Vote',
  'existing_members': 'Existing Members Vote',
  'council': 'Council Vote',
  
  // Boolean values
  'true': 'Yes',
  'false': 'No'
};

// Helper function to get human-readable text
const getReadableText = (value: string): string => {
  return humanReadableText[value] || value;
};

const DaoReviewDisplay: React.FC = () => {
  const { daoInfo, tokenInfo, membershipInfo, governanceInfo } = getDAOReviewData();

  // Get the logo display based on type
  const getLogoDisplay = () => {
    // No logo
    if (!daoInfo.logo) {
      return null;
    }

    // Generated logo (URL from Replicate API)
    if (daoInfo.logoType === 'generate' && daoInfo.logoUrl) {
      return (
        <div className="flex flex-col items-center mb-4">
          <span className="text-white/60 mb-2">Logo:</span>
          <div className="p-2 bg-[#222] border border-indigo-500/30 rounded-lg shadow-md">
            <img
              src={daoInfo.logoUrl}
              alt={`${daoInfo.name} logo`}
              className="max-h-24 max-w-full rounded-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder-image.png';
              }}
            />
          </div>
        </div>
      );
    }

    // Uploaded logo (might have a data URL in sessionStorage)
    if (daoInfo.logoType === 'upload') {
      // Try to get the data URL from sessionStorage
      try {
        const logoFile = sessionStorage.getItem('daoLogoFile');
        if (logoFile) {
          const fileData = JSON.parse(logoFile);
          if (fileData.dataUrl) {
            return (
              <div className="flex flex-col items-center mb-4">
                <span className="text-white/60 mb-2">Logo:</span>
                <div className="p-2 bg-[#222] border border-indigo-500/30 rounded-lg shadow-md">
                  <img
                    src={fileData.dataUrl}
                    alt={`${daoInfo.name} logo`}
                    className="max-h-24 max-w-full rounded-lg"
                  />
                </div>
              </div>
            );
          }
        }
      } catch (error) {
        console.error('Error displaying uploaded logo:', error);
      }
    }

    // Default text-only display
    return (
      <div className="flex justify-between items-center">
        <span className="text-white/60">Logo:</span>
        <span className="text-white font-medium">✓ {daoInfo.logoType === 'generate' ? 'Generated' : 'Uploaded'}</span>
      </div>
    );
  };

  return (
    <div className="w-full text-left bg-black/20 rounded-xl p-6 border border-indigo-500/20">
      <h3 className="text-center font-medium text-xl text-indigo-300 mb-6">DAO Summary</h3>
      
      {/* Basic DAO Information */}
      <div className="mb-6">
        <h4 className="font-medium text-indigo-400 mb-2 border-b border-indigo-500/20 pb-1">Basic Information</h4>
        <div className="grid grid-cols-1 gap-2">
          <div className="flex justify-between">
            <span className="text-white/60">Name:</span>
            <span className="text-white font-medium">{daoInfo.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/60">Description:</span>
            <span className="text-white font-medium">{daoInfo.description}</span>
          </div>
          
          {/* Logo display */}
          {getLogoDisplay()}
        </div>
      </div>
      
      {/* Social Links */}
      <div className="mb-6">
        <h4 className="font-medium text-indigo-400 mb-2 border-b border-indigo-500/20 pb-1">Social Links</h4>
        <div className="grid grid-cols-1 gap-2">
          {daoInfo.socials.twitter && (
            <div className="flex justify-between">
              <span className="text-white/60">Twitter:</span>
              <span className="text-white font-medium">{daoInfo.socials.twitter}</span>
            </div>
          )}
          {daoInfo.socials.discord && (
            <div className="flex justify-between">
              <span className="text-white/60">Discord:</span>
              <span className="text-white font-medium">{daoInfo.socials.discord}</span>
            </div>
          )}
          {daoInfo.socials.website && (
            <div className="flex justify-between">
              <span className="text-white/60">Website:</span>
              <span className="text-white font-medium">{daoInfo.socials.website}</span>
            </div>
          )}
          {daoInfo.socials.telegram && (
            <div className="flex justify-between">
              <span className="text-white/60">Telegram:</span>
              <span className="text-white font-medium">{daoInfo.socials.telegram}</span>
            </div>
          )}
          {daoInfo.socials.instagram && (
            <div className="flex justify-between">
              <span className="text-white/60">Instagram:</span>
              <span className="text-white font-medium">{daoInfo.socials.instagram}</span>
            </div>
          )}
          {daoInfo.socials.tiktok && (
            <div className="flex justify-between">
              <span className="text-white/60">TikTok:</span>
              <span className="text-white font-medium">{daoInfo.socials.tiktok}</span>
            </div>
          )}
          {/* If no social links are specified, show a message */}
          {!daoInfo.socials.twitter && !daoInfo.socials.discord && !daoInfo.socials.website && 
           !daoInfo.socials.telegram && !daoInfo.socials.instagram && !daoInfo.socials.tiktok && (
            <div className="text-center text-white/60 italic">No social links specified</div>
          )}
        </div>
      </div>
      
      {/* Token Information */}
      <div className="mb-6">
        <h4 className="font-medium text-indigo-400 mb-2 border-b border-indigo-500/20 pb-1">Token Information</h4>
        <div className="grid grid-cols-1 gap-2">
          <div className="flex justify-between">
            <span className="text-white/60">Token Status:</span>
            <span className="text-white font-medium">
              {tokenInfo.hasExistingToken ? 'Existing Token' : 'New Token'}
            </span>
          </div>
          
          {tokenInfo.hasExistingToken ? (
            <div className="flex justify-between">
              <span className="text-white/60">Token Address:</span>
              <span className="text-white font-medium">{tokenInfo.tokenAddress}</span>
            </div>
          ) : (
            <>
              <div className="flex justify-between">
                <span className="text-white/60">Token Name:</span>
                <span className="text-white font-medium">{tokenInfo.tokenName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Token Symbol:</span>
                <span className="text-white font-medium">{tokenInfo.tokenTicker}</span>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Membership Information */}
      <div className="mb-6">
        <h4 className="font-medium text-indigo-400 mb-2 border-b border-indigo-500/20 pb-1">Membership Rules</h4>
        <div className="grid grid-cols-1 gap-2">
          <div className="flex justify-between">
            <span className="text-white/60">Membership Condition:</span>
            <span className="text-white font-medium">{getReadableText(membershipInfo.membershipConditions)}</span>
          </div>
          
          {membershipInfo.membershipConditions === 'token_based' && (
            <div className="flex justify-between">
              <span className="text-white/60">Threshold Amount:</span>
              <span className="text-white font-medium">{membershipInfo.tokenThreshold}</span>
            </div>
          )}
          
          {membershipInfo.membershipConditions === 'application' && (
            <div className="flex justify-between">
              <span className="text-white/60">Application Review:</span>
              <span className="text-white font-medium">
                {getReadableText(membershipInfo.applicationApproval)}
              </span>
            </div>
          )}
        </div>
      </div>
      
      {/* Governance Information */}
      <div>
        <h4 className="font-medium text-indigo-400 mb-2 border-b border-indigo-500/20 pb-1">Governance Structure</h4>
        <div className="grid grid-cols-1 gap-2">
          <div className="flex justify-between">
            <span className="text-white/60">Governance Model:</span>
            <span className="text-white font-medium">{getReadableText(governanceInfo.governanceModel)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/60">Idea Submission:</span>
            <span className="text-white font-medium">{getReadableText(governanceInfo.ideaRights)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/60">Voting Rights:</span>
            <span className="text-white font-medium">{getReadableText(governanceInfo.voteRights)}</span>
          </div>
          
          {governanceInfo.survalidation === 'true' && (
            <div className="flex justify-between">
              <span className="text-white/60">Survalidation:</span>
              <span className="text-white font-medium">{getReadableText(governanceInfo.survalidationType)}</span>
            </div>
          )}
          
          <div className="flex justify-between">
            <span className="text-white/60">Voting Power:</span>
            <span className="text-white font-medium">{getReadableText(governanceInfo.votingPower)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/60">Vote Delegation:</span>
            <span className="text-white font-medium">
              {governanceInfo.voteDelegation === 'true' ? 'Allowed' : 'Not Allowed'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DaoReviewDisplay; 