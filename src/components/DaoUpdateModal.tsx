import React, { useState, useEffect, useRef } from 'react';
import { Loader, Upload } from 'lucide-react';
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
  const [discordServer, setDiscordServer] = useState<string>('');
  const [twitter, setTwitter] = useState<string>('');
  const [telegram, setTelegram] = useState<string>('');
  const [instagram, setInstagram] = useState<string>('');
  const [tiktok, setTiktok] = useState<string>('');
  const [website, setWebsite] = useState<string>('');
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [bannerPicture, setBannerPicture] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const profileInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

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
        setDiscordServer(daoInfo.discordServer || '');
        setTwitter(daoInfo.twitter || '');
        setTelegram(daoInfo.telegram || '');
        setInstagram(daoInfo.instagram || '');
        setTiktok(daoInfo.tiktok || '');
        setWebsite(daoInfo.website || '');
        // Note: Images are stored as URLs, so we can't set the File objects directly
        // They will need to be re-uploaded by the user if they want to change them
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error loading DAO information:', err);
      setError('Failed to load DAO information. Please try again.');
      setLoading(false);
    }
  };

  // Function to handle image uploads
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'banner') => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match(/^image\/(jpeg|jpg|png|gif)$/)) {
      setError('Please upload an image file (JPEG, PNG, or GIF)');
      return;
    }

    // Validate file size (e.g., max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image file size must be less than 5MB');
      return;
    }

    if (type === 'profile') {
      setProfilePicture(file);
    } else {
      setBannerPicture(file);
    }
    setError(null);
  };

  // Function to save DAO information
  const saveChanges = async () => {
    if (!daoId) return;
    
    try {
      setSaving(true);
      setError(null);
      
      // Call the DAO-API SDK to update DAO information
      await daosService.updateDao(daoId, {
        name: daoName.trim(),
        description: daoDescription.trim(),
        discordServer: discordServer,
        twitter: twitter,
        telegram: telegram,
        instagram: instagram,
        tiktok: tiktok,
        website: website,
        profilePicture: profilePicture || undefined,
        bannerPicture: bannerPicture || undefined
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="discordServer" className="block text-sm font-medium text-gray-300">
                Discord Server
              </label>
              <input
                type="text"
                id="discordServer"
                value={discordServer}
                onChange={(e) => setDiscordServer(e.target.value)}
                className="w-full px-3 py-2 bg-[#222] border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Discord server invite link"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="twitter" className="block text-sm font-medium text-gray-300">
                Twitter
              </label>
              <input
                type="text"
                id="twitter"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                className="w-full px-3 py-2 bg-[#222] border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Twitter handle"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="telegram" className="block text-sm font-medium text-gray-300">
                Telegram
              </label>
              <input
                type="text"
                id="telegram"
                value={telegram}
                onChange={(e) => setTelegram(e.target.value)}
                className="w-full px-3 py-2 bg-[#222] border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Telegram group link"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="instagram" className="block text-sm font-medium text-gray-300">
                Instagram
              </label>
              <input
                type="text"
                id="instagram"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className="w-full px-3 py-2 bg-[#222] border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Instagram handle"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="tiktok" className="block text-sm font-medium text-gray-300">
                TikTok
              </label>
              <input
                type="text"
                id="tiktok"
                value={tiktok}
                onChange={(e) => setTiktok(e.target.value)}
                className="w-full px-3 py-2 bg-[#222] border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="TikTok username"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="website" className="block text-sm font-medium text-gray-300">
                Website
              </label>
              <input
                type="text"
                id="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full px-3 py-2 bg-[#222] border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Website URL"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-300">
                Profile Picture
              </label>
              <input
                type="file"
                id="profilePicture"
                ref={profileInputRef}
                onChange={(e) => handleImageUpload(e, 'profile')}
                accept="image/jpeg,image/png,image/gif"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => profileInputRef.current?.click()}
                className="w-full px-3 py-2 bg-[#222] border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary flex items-center justify-center"
              >
                <Upload className="w-4 h-4 mr-2" />
                {profilePicture ? profilePicture.name : 'Upload Profile Picture'}
              </button>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="bannerPicture" className="block text-sm font-medium text-gray-300">
                Banner Picture
              </label>
              <input
                type="file"
                id="bannerPicture"
                ref={bannerInputRef}
                onChange={(e) => handleImageUpload(e, 'banner')}
                accept="image/jpeg,image/png,image/gif"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => bannerInputRef.current?.click()}
                className="w-full px-3 py-2 bg-[#222] border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary flex items-center justify-center"
              >
                <Upload className="w-4 h-4 mr-2" />
                {bannerPicture ? bannerPicture.name : 'Upload Banner Picture'}
              </button>
            </div>
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