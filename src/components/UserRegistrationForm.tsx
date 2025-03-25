import React, { useState, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { AlertCircle, Upload } from 'lucide-react';
import { validateImageFile } from '../utils/fileUtils';

interface UserRegistrationFormProps {
  walletAddress: string;
  onSubmit: (userInfo: {
    username: string;
    email: string;
    memberName: string;  // Display name
    profilePicture?: File;
  }) => void;
  onCancel: () => void;
  apiError?: string; // API error message
  // Default values from previous submission (for error recovery)
  username?: string;
  email?: string;
  memberName?: string;
}

const UserRegistrationForm: React.FC<UserRegistrationFormProps> = ({
  walletAddress,
  onSubmit,
  onCancel,
  apiError,
  // Default values
  username: defaultUsername = '',
  email: defaultEmail = '',
  memberName: defaultMemberName = '',
}) => {
  const [username, setUsername] = useState(defaultUsername);
  const [email, setEmail] = useState(defaultEmail);
  const [memberName, setMemberName] = useState(defaultMemberName);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const profileInputRef = useRef<HTMLInputElement>(null);

  const [errors, setErrors] = useState<{
    username?: string;
    email?: string;
    [key: string]: string | undefined;
  }>({});

  const validateForm = (): boolean => {
    const newErrors: {
      username?: string;
      email?: string;
      [key: string]: string | undefined;
    } = {};
    
    if (!username.trim()) {
      newErrors.username = 'Username is required';
    } else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Use the utility function for validation
    const errorMessage = validateImageFile(file);
    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    setProfilePicture(file);
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        username,
        email,
        memberName,
        profilePicture: profilePicture || undefined
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-surface-menu rounded-lg shadow-xl p-6 max-w-xl w-full">
        <h2 className="text-xl font-semibold text-text mb-4">Complete Your Profile</h2>
        
        <p className="text-surface-500 mb-4">
          Please provide some information to complete your registration with wallet address:
          <span className="block mt-1 text-sm font-mono bg-[#1a1a1a] p-2 rounded overflow-hidden text-ellipsis">
            {walletAddress}
          </span>
        </p>

        {/* API Error Message */}
        {apiError && (
          <div className="mb-4 p-3 bg-red-900 bg-opacity-30 border border-red-700 rounded text-error flex items-start">
            <AlertCircle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-sm">{apiError}</span>
          </div>
        )}

        {/* Upload Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-900 bg-opacity-30 border border-red-700 rounded text-error flex items-start">
            <AlertCircle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="max-h-[60vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Username (Required) */}
            <div className="col-span-1">
              <label className="block text-text opacity-80 text-sm font-bold mb-2" htmlFor="username">
                Username <span className="text-error">*</span>
              </label>
              <input
                id="username"
                type="text"
                className={`w-full px-3 py-2 bg-surface-300 border ${errors.username ? 'border-error' : 'border-[#444444]'} rounded focus:outline-none focus:ring-1 focus:ring-primary text-text`}
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Choose a username"
              />
              {errors.username && (
                <p className="text-error text-xs mt-1">{errors.username}</p>
              )}
            </div>

            {/* Display Name */}
            <div className="col-span-1">
              <label className="block text-text opacity-80 text-sm font-bold mb-2" htmlFor="memberName">
                Display Name
              </label>
              <input
                id="memberName"
                type="text"
                className="w-full px-3 py-2 bg-surface-300 border border-[#444444] rounded focus:outline-none focus:ring-1 focus:ring-primary text-text"
                value={memberName}
                onChange={e => setMemberName(e.target.value)}
                placeholder="Your display name"
              />
            </div>
            
            {/* Email (Optional) */}
            <div className="col-span-2">
              <label className="block text-text opacity-80 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                className={`w-full px-3 py-2 bg-surface-300 border ${errors.email ? 'border-error' : 'border-[#444444]'} rounded focus:outline-none focus:ring-1 focus:ring-primary text-text`}
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-error text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Profile Picture Upload */}
            <div className="col-span-2">
              <label className="block text-text opacity-80 text-sm font-bold mb-2" htmlFor="profilePicture">
                Profile Picture
              </label>
              <input
                type="file"
                id="profilePicture"
                ref={profileInputRef}
                onChange={handleImageUpload}
                accept="image/jpeg,image/png,image/gif"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => profileInputRef.current?.click()}
                className="w-full px-3 py-2 bg-surface-300 border border-[#444444] rounded focus:outline-none focus:ring-1 focus:ring-primary text-text flex items-center justify-center"
              >
                <Upload className="w-4 h-4 mr-2" />
                {profilePicture ? profilePicture.name : 'Upload Profile Picture'}
              </button>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded bg-surface-300 text-text opacity-80 hover:bg-[#444444] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-primary text-text hover:bg-primary transition-colors"
            >
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserRegistrationForm; 