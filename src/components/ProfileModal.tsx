import React from 'react';
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
    >
      <UserProfile />
    </Modal>
  );
};

export default ProfileModal; 