import * as React from 'react';
import Modal from './common/Modal';
import { apiKeyService } from '../services/ApiKeyService';
import { Device } from '../core/modules/dao-api/models/Device';
import { DeviceWithKey } from '../core/modules/dao-api/models/DeviceWithKey';
import { Copy, Plus, Trash2, AlertCircle } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose }) => {
  const [apiKeys, setApiKeys] = React.useState<Device[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [newKeyName, setNewKeyName] = React.useState('');
  const [newKey, setNewKey] = React.useState<DeviceWithKey | null>(null);
  const [copied, setCopied] = React.useState(false);

  // Fetch API keys when modal opens
  React.useEffect(() => {
    if (isOpen) {
      fetchApiKeys();
    }
  }, [isOpen]);

  // Fetch API keys from the service
  const fetchApiKeys = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiKeyService.getApiKeys();
      if (response && response.devices) {
        setApiKeys(response.devices);
      } else {
        setApiKeys([]);
      }
    } catch (err) {
      setError('Failed to load API keys');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new API key
  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) {
      setError('API key name is required');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await apiKeyService.createApiKey(newKeyName);
      if (response && response.device) {
        setNewKey(response.device);
        await fetchApiKeys(); // Refresh the list
        setNewKeyName('');
      } else {
        setError('Failed to create API key');
      }
    } catch (err) {
      setError('Error creating API key');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete an API key
  const handleDeleteKey = async (deviceId: string) => {
    if (!confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await apiKeyService.deleteApiKey(deviceId);
      await fetchApiKeys(); // Refresh the list
    } catch (err) {
      setError('Failed to delete API key');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Copy API key to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="API Keys"
    >
      <div className="space-y-6">
        {error && (
          <div className="bg-red-500/20 border border-red-500 rounded-md p-3 flex items-start">
            <AlertCircle className="text-red-500 mr-2 mt-0.5 flex-shrink-0" size={16} />
            <span className="text-red-100">{error}</span>
          </div>
        )}

        {/* Create new API key form */}
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
          <h3 className="text-lg font-medium text-white mb-3">Create New API Key</h3>
          <form onSubmit={handleCreateKey} className="space-y-4">
            <div>
              <label htmlFor="apiKeyName" className="block text-sm font-medium text-gray-400 mb-1">
                API Key Name
              </label>
              <input
                type="text"
                id="apiKeyName"
                className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="My API Key"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                disabled={isLoading}
              />
              <p className="mt-1 text-xs text-gray-500">Give your API key a name to identify its purpose.</p>
            </div>
            <button
              type="submit"
              className="flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition w-full disabled:opacity-50 disabled:pointer-events-none"
              disabled={isLoading || !newKeyName.trim()}
            >
              <Plus size={16} className="mr-2" />
              Create API Key
            </button>
          </form>
        </div>

        {/* Display new API key if one was just created */}
        {newKey && (
          <div className="bg-green-500/20 border border-green-500 rounded-lg p-4 animate-fadeIn">
            <h3 className="text-lg font-medium text-white mb-2">API Key Created!</h3>
            <p className="text-sm text-gray-300 mb-3">
              This is the only time the full API key will be displayed. Make sure to copy it now.
            </p>
            <div className="flex items-center bg-gray-900 border border-gray-700 rounded-md p-2 mb-3">
              <code className="text-green-400 flex-1 overflow-x-auto whitespace-nowrap py-1 px-2">{newKey.deviceKey}</code>
              <button
                onClick={() => copyToClipboard(newKey.deviceKey)}
                className="ml-2 p-2 text-gray-400 hover:text-white rounded-md hover:bg-gray-800 transition"
                title="Copy to clipboard"
              >
                <Copy size={16} />
              </button>
            </div>
            {copied && (
              <p className="text-sm text-green-400 animate-fadeIn">API key copied to clipboard!</p>
            )}
            <button
              onClick={() => setNewKey(null)}
              className="text-sm text-gray-400 hover:text-white"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* List of existing API keys */}
        <div>
          <h3 className="text-lg font-medium text-white mb-3">Your API Keys</h3>
          {isLoading ? (
            <p className="text-gray-400">Loading API keys...</p>
          ) : apiKeys.length === 0 ? (
            <p className="text-gray-400">You don't have any API keys yet.</p>
          ) : (
            <div className="space-y-3">
              {apiKeys.map((key) => (
                <div 
                  key={key.id} 
                  className="bg-gray-900 border border-gray-800 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between"
                >
                  <div className="mb-3 sm:mb-0">
                    <div className="font-medium text-white">{key.deviceName}</div>
                    <div className="text-sm text-gray-400">
                      {key.deviceKey && (
                        <div className="font-mono">{key.deviceKey}</div>
                      )}
                      <div>Created: {new Date(key.createdAt).toLocaleDateString()}</div>
                      {key.lastUsed && (
                        <div>Last used: {new Date(key.lastUsed).toLocaleDateString()}</div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteKey(key.id)}
                    className="flex items-center justify-center px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-md transition text-sm"
                    disabled={isLoading}
                  >
                    <Trash2 size={14} className="mr-1" />
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ApiKeyModal; 