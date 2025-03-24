import React from 'react';
import Modal from './common/Modal';
import { ExternalLink, Calendar, Clock, MessageSquare, Github, Twitter, Globe, MoreHorizontal, Award, Users } from 'lucide-react';
import Badge from './common/Badge';
import { ui, typography } from '../styles/theme';
import { formatDistanceToNow } from 'date-fns';

interface SocialMedia {
  platform: string;
  username: string;
  url?: string;
}

interface Pod {
  id: string;
  name: string;
}

interface DAOInfo {
  id: string;
  name: string;
  joinedAt: string | Date;
}

export interface UserProfileData {
  id: string;
  username: string;
  name: string;
  avatar?: string;
  bio?: string;
  walletAddress: string;
  socials: SocialMedia[];
  pods: Pod[];
  daos: DAOInfo[];
  lastActivity?: string | Date;
  lastLogin?: string | Date;
  joinedAt?: string | Date;
  reputationScore?: number;
  contributions?: number;
  reputation?: number;
}

export interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfileData | null;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose, user }) => {
  // Format date to readable format
  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return 'N/A';
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString();
  };

  // Calculate time ago
  const timeAgo = (dateString?: string | Date) => {
    if (!dateString) return 'N/A';
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return formatDistanceToNow(date, { addSuffix: true });
  };

  // Truncate wallet address
  const truncateAddress = (address?: string) => {
    if (!address) return 'N/A';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Get social media icon
  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'twitter':
        return <Twitter size={18} className="text-blue-400" />;
      case 'github':
        return <Github size={18} className="text-white" />;
      case 'discord':
        return <MoreHorizontal size={18} className="text-purple-400" />;
      default:
        return <MoreHorizontal size={18} />;
    }
  };

  // Get social media link
  const getSocialLink = (platform: string, username: string) => {
    switch (platform.toLowerCase()) {
      case 'twitter':
        return `https://twitter.com/${username}`;
      case 'github':
        return `https://github.com/${username}`;
      case 'discord':
        return `https://discord.com/users/${username}`;
      case 'website':
        return username;
      default:
        return '#';
    }
  };

  if (!user && isOpen) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="User Profile">
        <div className="text-center py-8">
          <p className="text-gray-400">User data not available</p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={user?.name || 'User Profile'}>
      {user && (
        <div className="space-y-6">
          {/* User Header */}
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white text-2xl font-medium">
              {user.name.substring(0, 1)}
            </div>
            <div>
              <h2 className={typography.h3}>{user.name}</h2>
              <p className="text-gray-400">@{user.username}</p>
              {user.walletAddress && (
                <p className="text-sm text-gray-500 mt-1">
                  {truncateAddress(user.walletAddress)}
                </p>
              )}
            </div>
          </div>

          {/* Bio Section - if provided */}
          {user.bio && (
            <div className="bg-[#1A1A1A] p-4 rounded-lg">
              <p className="text-gray-300">{user.bio}</p>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Reputation stats if available */}
            {user.reputation && (
              <div className="bg-[#1A1A1A] p-4 rounded-lg">
                <div className="flex items-center text-purple-500 mb-2">
                  <Award size={18} className="mr-2" />
                  <h3 className="font-medium">Reputation</h3>
                </div>
                <p className="text-2xl font-bold text-white">{user.reputation}</p>
              </div>
            )}

            {/* DAOs */}
            <div className="bg-[#1A1A1A] p-4 rounded-lg">
              <div className="flex items-center text-purple-500 mb-2">
                <Users size={18} className="mr-2" />
                <h3 className="font-medium">DAOs</h3>
              </div>
              <p className="text-2xl font-bold text-white">{user.daos?.length || 0}</p>
            </div>

            {/* PODs */}
            <div className="bg-[#1A1A1A] p-4 rounded-lg">
              <div className="flex items-center text-purple-500 mb-2">
                <MessageSquare size={18} className="mr-2" />
                <h3 className="font-medium">PODs</h3>
              </div>
              <p className="text-2xl font-bold text-white">{user.pods?.length || 0}</p>
            </div>
          </div>

          {/* Social Links */}
          {user.socials && user.socials.length > 0 && (
            <div>
              <h3 className={typography.h4 + " mb-3"}>Social Media</h3>
              <div className="flex flex-wrap gap-3">
                {user.socials.map((social, index) => (
                  <a 
                    key={index}
                    href={getSocialLink(social.platform, social.username)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center bg-[#1A1A1A] p-2 rounded-lg text-gray-300 hover:bg-[#252525] transition"
                  >
                    {getSocialIcon(social.platform)}
                    <span className="ml-2">{social.username}</span>
                    <ExternalLink size={14} className="ml-2 text-gray-500" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Member of Pods */}
          {user.pods && user.pods.length > 0 && (
            <div>
              <h3 className={typography.h4 + " mb-3"}>Member of Pods</h3>
              <div className="flex flex-wrap gap-2">
                {user.pods.map((pod, index) => (
                  <span key={index} className="bg-[#1A1A1A] px-3 py-1 rounded-full text-sm text-gray-300">
                    {pod.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Activity */}
          <div>
            <h3 className={typography.h4 + " mb-3"}>Activity</h3>
            <div className="space-y-3">
              {user.joinedAt && (
                <div className="flex items-center text-gray-400">
                  <Calendar size={18} className="mr-3 text-purple-500" />
                  <span>Joined {formatDate(user.joinedAt)}</span>
                </div>
              )}
              {user.lastActivity && (
                <div className="flex items-center text-gray-400">
                  <Clock size={18} className="mr-3 text-purple-500" />
                  <span>Last Active {timeAgo(user.lastActivity)}</span>
                </div>
              )}
              {user.lastLogin && (
                <div className="flex items-center text-gray-400">
                  <Users size={18} className="mr-3 text-purple-500" />
                  <span>Last Login {timeAgo(user.lastLogin)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default UserProfileModal; 