import React, { useState, useEffect } from 'react';
import { Loader } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { daosService } from '../services/DaosService';
import DaoFormModal from './DaoFormModal';

interface DaoUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DaoUpdateModal: React.FC<DaoUpdateModalProps> = ({ isOpen, onClose }) => {
  const { daoId } = useParams<{ daoId: string }>();
  const [daoName, setDaoName] = useState<string>('');
  const [daoDescription, setDaoDescription] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load DAO information when the modal is opened
  useEffect(() => {
    if (isOpen && daoId) {
      loadDaoInfo();
    }
  }, [isOpen, daoId]);

  // Function to load DAO information
  const loadDaoInfo = async () => {
    if (!daoId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Call the DAO-API SDK to get DAO information
      const daoInfo = await daosService.getDaoById(daoId);
      
      // Update state with DAO information if daoInfo is not null
      if (daoInfo) {
        setDaoName(daoInfo.name || '');
        setDaoDescription(daoInfo.description || '');
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error loading DAO information:', err);
      setError('Failed to load DAO information. Please try again.');
      setLoading(false);
    }
  };

  // Function to save DAO information
  const saveChanges = async () => {
    if (!daoId) return;
    
    try {
      setSaving(true);
      setError(null);
      
      // Call the DAO-API SDK to update DAO information
      await daosService.updateDao(daoId, {
        name: daoName,
        description: daoDescription
      });
      
      setSaving(false);
      
      // Close the modal after successful update
      onClose();
    } catch (err) {
      console.error('Error updating DAO information:', err);
      setError('Failed to update DAO information. Please try again.');
      setSaving(false);
    }
  };

  return (
    <DaoFormModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Update DAO Information"
    >
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <Loader className="animate-spin text-primary" size={32} />
        </div>
      ) : (
        <div className="space-y-4">
          {error && (
            <div className="bg-red-900/30 border border-red-800 text-red-300 p-3 rounded-md">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label htmlFor="daoName" className="block text-sm font-medium text-gray-300">
              DAO Name
            </label>
            <input
              type="text"
              id="daoName"
              value={daoName}
              onChange={(e) => setDaoName(e.target.value)}
              className="w-full px-3 py-2 bg-[#222] border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter DAO name"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="daoDescription" className="block text-sm font-medium text-gray-300">
              Description
            </label>
            <textarea
              id="daoDescription"
              rows={4}
              value={daoDescription}
              onChange={(e) => setDaoDescription(e.target.value)}
              className="w-full px-3 py-2 bg-[#222] border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter DAO description"
            ></textarea>
          </div>
          
          <div className="pt-4">
            <button 
              onClick={saveChanges}
              disabled={saving}
              className="w-full py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {saving ? (
                <>
                  <Loader className="animate-spin mr-2" size={16} />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>
      )}
    </DaoFormModal>
  );
};

export default DaoUpdateModal; 