import React from 'react';
import { X, Check, AlertCircle, Clock, Calendar, Building, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from './common/Button';
import { typography, ui } from '../styles/theme';
import { userService } from '../services/UserService';

// Generic interface for application data
interface ApplicationData {
  applicationId?: string;
  daoId?: string;
  daoName?: string;
  message?: string;
  status?: string;
  createdAt?: string;
  response?: string;
  [key: string]: any; // Allow for additional properties
}

type ApplicationStatus = 'pending' | 'accepted' | 'rejected' | 'all';

interface ApplicationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ApplicationsModal = ({
  isOpen,
  onClose
}: ApplicationsModalProps): React.ReactElement | null => {
  const navigate = useNavigate();
  const [applications, setApplications] = React.useState<ApplicationData[]>([]);
  const [filteredApplications, setFilteredApplications] = React.useState<ApplicationData[]>([]);
  const [activeFilter, setActiveFilter] = React.useState<ApplicationStatus>('pending');
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      fetchApplications();
    }
  }, [isOpen]);

  // Apply filter when applications or activeFilter changes
  React.useEffect(() => {
    filterApplications();
  }, [applications, activeFilter]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.getUserApplications();
      
      if (response && response.applications) {
        setApplications(response.applications);
        console.log('User applications:', response.applications);
      } else {
        setApplications([]);
      }
    } catch (err) {
      console.error('Error fetching user applications:', err);
      setError('Failed to load applications. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    if (activeFilter === 'all') {
      setFilteredApplications(applications);
    } else {
      setFilteredApplications(
        applications.filter((app: ApplicationData) => app.status === activeFilter)
      );
    }
  };

  const handleFilterChange = (filter: ApplicationStatus) => {
    setActiveFilter(filter);
  };

  const handleViewDao = (daoId: string) => {
    onClose();
    navigate(`/daos/${daoId}`);
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'Unknown date';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    }).format(date);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return (
          <span className={ui.badge.success}>
            <Check size={12} className="mr-1" />
            Accepted
          </span>
        );
      case 'rejected':
        return (
          <span className={ui.badge.error}>
            <X size={12} className="mr-1" />
            Rejected
          </span>
        );
      case 'pending':
      default:
        return (
          <span className={ui.badge.warning}>
            <Clock size={12} className="mr-1" />
            Pending
          </span>
        );
    }
  };

  // Count applications by status
  const getApplicationCounts = () => {
    const counts = { pending: 0, accepted: 0, rejected: 0, total: applications.length };
    
    applications.forEach((app: ApplicationData) => {
      if (app.status === 'pending') counts.pending++;
      if (app.status === 'accepted') counts.accepted++;
      if (app.status === 'rejected') counts.rejected++;
    });
    
    return counts;
  };

  const counts = getApplicationCounts();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#1A1A1A] rounded-xl p-6 max-w-2xl w-full shadow-2xl border border-gray-700 max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className={typography.h2}>My DAO Applications</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-800">
            <X size={20} />
          </button>
        </div>
        
        {error && (
          <div className="bg-red-900/30 border border-red-500 rounded-md p-3 mb-4 text-red-300 flex items-start">
            <AlertCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Filter tabs */}
        {!loading && applications.length > 0 && (
          <div className="flex border-b border-gray-700 mb-4">
            <button
              onClick={() => handleFilterChange('pending')}
              className={`px-4 py-2 text-sm font-medium ${
                activeFilter === 'pending'
                  ? 'text-indigo-400 border-b-2 border-indigo-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Pending ({counts.pending})
            </button>
            <button
              onClick={() => handleFilterChange('accepted')}
              className={`px-4 py-2 text-sm font-medium ${
                activeFilter === 'accepted'
                  ? 'text-green-400 border-b-2 border-green-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Accepted ({counts.accepted})
            </button>
            <button
              onClick={() => handleFilterChange('rejected')}
              className={`px-4 py-2 text-sm font-medium ${
                activeFilter === 'rejected'
                  ? 'text-red-400 border-b-2 border-red-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Rejected ({counts.rejected})
            </button>
          </div>
        )}
        
        <div className="overflow-y-auto flex-grow custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="w-12 h-12 border-t-2 border-b-2 border-indigo-500 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-400">Loading applications...</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FileText size={48} className="text-gray-500 mb-4" />
              <p className={typography.h4 + " text-gray-300 mb-2"}>No Applications Found</p>
              <p className="text-gray-500 max-w-md">
                You haven't applied to join any DAOs yet. When you submit an application to join a DAO, it will appear here.
              </p>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FileText size={48} className="text-gray-500 mb-4" />
              <p className={typography.h4 + " text-gray-300 mb-2"}>No {activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} Applications</p>
              <p className="text-gray-500 max-w-md">
                You don't have any {activeFilter} applications.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredApplications.map((application: ApplicationData) => (
                <div 
                  key={application.applicationId} 
                  className="bg-[#222]/80 border border-gray-700 rounded-lg p-4"
                >
                  <div className="flex justify-between mb-2">
                    <h3 className={typography.h3}>{application.daoName || 'Unknown DAO'}</h3>
                    {getStatusBadge(application.status || 'pending')}
                  </div>
                  
                  <div className="flex items-start mb-4">
                    <div className="flex-shrink-0 bg-indigo-900/30 rounded-full p-2 mr-3">
                      <Building size={16} className="text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-gray-300 mb-1">
                        {application.message || "No application message provided."}
                      </p>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar size={12} className="mr-1" />
                        <span>Applied: {formatDate(application.createdAt)}</span>
                      </div>
                      {application.response && (
                        <div className="mt-3 p-2 bg-gray-800/50 rounded border border-gray-700 text-sm">
                          <p className="font-medium text-gray-300 mb-1">Response:</p>
                          <p className="text-gray-400">{application.response}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      variant="secondary" 
                      size="small" 
                      onClick={() => handleViewDao(application.daoId || '')}
                      disabled={!application.daoId}
                    >
                      View DAO
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationsModal; 