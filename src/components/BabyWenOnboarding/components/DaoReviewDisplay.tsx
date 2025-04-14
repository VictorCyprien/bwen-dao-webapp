import React from 'react';
import { getDAOReviewData } from '../steps/4_Review/DaoReviewStep';

const DaoReviewDisplay: React.FC = () => {
  const { daoInfo, tokenInfo, membershipInfo, governanceInfo } = getDAOReviewData();

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
          {daoInfo.logo && (
            <div className="flex justify-between items-center">
              <span className="text-white/60">Logo:</span>
              <span className="text-white font-medium">✓ Uploaded</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Social Links */}
      <div className="mb-6">
        <h4 className="font-medium text-indigo-400 mb-2 border-b border-indigo-500/20 pb-1">Social Links</h4>
        <div className="grid grid-cols-1 gap-2">
          <div className="flex justify-between">
            <span className="text-white/60">Twitter:</span>
            <span className="text-white font-medium">{daoInfo.socials.twitter}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/60">Discord:</span>
            <span className="text-white font-medium">{daoInfo.socials.discord}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/60">Website:</span>
            <span className="text-white font-medium">{daoInfo.socials.website}</span>
          </div>
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
            <span className="text-white font-medium">{membershipInfo.membershipConditions}</span>
          </div>
          
          {membershipInfo.membershipConditions === 'Token Threshold' && (
            <div className="flex justify-between">
              <span className="text-white/60">Threshold Amount:</span>
              <span className="text-white font-medium">{membershipInfo.tokenThreshold}</span>
            </div>
          )}
          
          {membershipInfo.membershipConditions === 'Application' && (
            <div className="flex justify-between">
              <span className="text-white/60">Application Review:</span>
              <span className="text-white font-medium">
                {membershipInfo.applicationApproval ? 'Required' : 'Open Access'}
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
            <span className="text-white font-medium">{governanceInfo.governanceModel}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/60">Idea Submission:</span>
            <span className="text-white font-medium">{governanceInfo.ideaRights}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/60">Voting Rights:</span>
            <span className="text-white font-medium">{governanceInfo.voteRights}</span>
          </div>
          
          {governanceInfo.survalidation && (
            <div className="flex justify-between">
              <span className="text-white/60">Survalidation:</span>
              <span className="text-white font-medium">Enabled</span>
            </div>
          )}
          
          <div className="flex justify-between">
            <span className="text-white/60">Voting Power:</span>
            <span className="text-white font-medium">{governanceInfo.votingPower}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/60">Vote Delegation:</span>
            <span className="text-white font-medium">
              {governanceInfo.voteDelegation ? 'Allowed' : 'Not Allowed'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DaoReviewDisplay; 