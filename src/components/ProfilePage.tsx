import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import UserProfile from './UserProfile';
import Modal from './common/Modal';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Your Profile"
      maxWidth="max-w-2xl"
    >
      <UserProfile />
    </Modal>
  );
};

export default ProfileModal; 