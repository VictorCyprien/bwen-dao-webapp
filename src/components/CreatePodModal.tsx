import React, { useState } from 'react';
import { podsService } from '../services/PodsService';
import Modal from './common/Modal';

interface CreatePodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  daoId?: string;
}

const CreatePodModal: React.FC<CreatePodModalProps> = ({ isOpen, onClose, onSuccess, daoId }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [discordChannelId, setDiscordChannelId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!daoId) {
      setError('No DAO ID provided. Please select a DAO first.');
      return;
    }

    if (!name.trim()) {
      setError('Pod name is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await podsService.createPod(daoId, {
        name: name.trim(),
        description: description.trim()
      });

      console.log('Created POD:', result);

      if (result) {
        // If discord channel ID is provided, link it to the POD
        if (discordChannelId.trim() && result.podId) {
          console.log('Linking Discord channel to POD:', result.podId, discordChannelId.trim());
          const linkResult = await podsService.linkDiscordChannelToPOD(
            daoId, 
            result.podId, 
            discordChannelId.trim()
          );
          
          if (!linkResult) {
            console.warn('Created POD successfully but failed to link Discord channel.');
          }
        }
        
        onSuccess();
        onClose();
      } else {
        setError('Failed to create POD. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Error creating POD:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create a New POD"
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
            Discord Channel ID (optional)
          </label>
          <input
            id="discord-channel-id"
            type="text"
            value={discordChannelId}
            onChange={(e) => setDiscordChannelId(e.target.value)}
            className="w-full bg-[#191919] border border-gray-800 rounded-md p-2 text-white focus:outline-none focus:border-purple-600"
            placeholder="Enter Discord channel ID"
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
            {loading ? 'Creating...' : 'Create POD'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreatePodModal; 