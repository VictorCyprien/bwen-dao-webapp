import React, { useState, useEffect } from 'react';
import { podsService } from '../services/PodsService';
import { POD } from '../core/modules/dao-api/models/POD';
import Modal from './common/Modal';

interface UpdatePodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  daoId?: string;
  pod: POD | null;
}

const UpdatePodModal: React.FC<UpdatePodModalProps> = ({ isOpen, onClose, onSuccess, daoId, pod }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [discordChannelId, setDiscordChannelId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update form fields when pod changes
  useEffect(() => {
    if (pod) {
      setName(pod.name || '');
      setDescription(pod.description || '');
      // Note: We don't have Discord channel ID in the pod object, 
      // this would need to be fetched separately if needed
      setDiscordChannelId('');
    }
  }, [pod]);

  if (!pod) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!daoId) {
      setError('No DAO ID provided. Please select a DAO first.');
      return;
    }

    if (!pod.podId) {
      setError('Invalid POD. Missing POD ID.');
      return;
    }

    if (!name.trim()) {
      setError('Pod name is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await podsService.updatePod(daoId, pod.podId, {
        name: name.trim(),
        description: description.trim()
      });

      if (result) {
        // If a new discord channel ID is provided, link it to the POD
        if (discordChannelId.trim()) {
          const linkResult = await podsService.linkDiscordChannelToPOD(
            daoId, 
            pod.podId, 
            discordChannelId.trim()
          );
          
          if (!linkResult) {
            console.warn('Updated POD successfully but failed to link Discord channel.');
          }
        }
        
        onSuccess();
        onClose();
      } else {
        setError('Failed to update POD. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Error updating POD:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Update POD"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="pod-name" className="block text-gray-300 mb-1">
            POD Name*
          </label>
          <input
            id="pod-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-[#191919] border border-gray-800 rounded-md p-2 text-white focus:outline-none focus:border-purple-600"
            placeholder="Enter POD name"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="pod-description" className="block text-gray-300 mb-1">
            Description
          </label>
          <textarea
            id="pod-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-[#191919] border border-gray-800 rounded-md p-2 text-white focus:outline-none focus:border-purple-600 h-24"
            placeholder="Enter POD description"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="discord-channel-id" className="block text-gray-300 mb-1">
            New Discord Channel ID (optional)
          </label>
          <input
            id="discord-channel-id"
            type="text"
            value={discordChannelId}
            onChange={(e) => setDiscordChannelId(e.target.value)}
            className="w-full bg-[#191919] border border-gray-800 rounded-md p-2 text-white focus:outline-none focus:border-purple-600"
            placeholder="Enter new Discord channel ID"
          />
          <p className="text-gray-500 text-xs mt-1">
            If provided, this POD will be linked to the specified Discord channel.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-800 text-red-400 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-700 text-gray-300 rounded-md hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-md hover:opacity-90 disabled:opacity-70 transition-all"
          >
            {loading ? 'Updating...' : 'Update POD'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default UpdatePodModal; 