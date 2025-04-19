import React, { ReactNode } from 'react';
import Modal from './common/Modal';

interface DaoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const DaoFormModal: React.FC<DaoFormModalProps> = ({ isOpen, onClose, title, children }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="max-w-2xl"
    >
      {children}
    </Modal>
  );
};

export default DaoFormModal; 