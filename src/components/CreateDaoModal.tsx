import React from 'react';
import DaoFormModal from './DaoFormModal';
import CreateDaoForm from './CreateDaoForm';

interface CreateDaoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (daoId: string) => void;
}

const CreateDaoModal: React.FC<CreateDaoModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  return (
    <DaoFormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Create DAO"
    >
      <CreateDaoForm 
        isModal={true} 
        onSuccess={(daoId) => {
          if (onSuccess) onSuccess(daoId);
          onClose();
        }}
      />
    </DaoFormModal>
  );
};

export default CreateDaoModal; 