import React from 'react';
import { X, Check, AlertCircle, Clock, Calendar, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from './common/Button';
import { typography, ui } from '../styles/theme';
import { daosService } from '../services/DaosService';
import { userService } from '../services/UserService';
import { UserInvitation } from '../core/modules/dao-api/models/UserInvitation';

interface InvitationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InvitationsModal = ({
  isOpen,
  onClose
}: InvitationsModalProps): React.ReactElement | null => {
  const navigate = useNavigate();
  const [invitations, setInvitations] = React.useState<UserInvitation[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [actionLoading, setActionLoading] = React.useState<{[key: string]: boolean}>({});

  React.useEffect(() => {
    if (isOpen) {
      fetchInvitations();
    }
  }, [isOpen]);

  const fetchInvitations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.getUserInvitations();
      
      // Check the structure of the response and extract the invitations array
      if (response) {
        // The response likely has an 'invitations' property containing the array
        const allInvitations = response.invitations || [];
        
        // Filter to only show pending invitations
        const pendingInvitations = allInvitations.filter(
          (invitation: any) => invitation.status === 'pending'
        );
        
        setInvitations(pendingInvitations as UserInvitation[]);
        console.log('All invitations:', allInvitations);
        console.log('Pending invitations:', pendingInvitations);
      } else {
        setInvitations([]);
      }
    } catch (err) {
      console.error('Error fetching invitations:', err);
      setError('Failed to load invitations. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleInvitationResponse = async (invitationId: string, accept: boolean) => {
    try {
      setActionLoading((prev: {[key: string]: boolean}) => ({ ...prev, [invitationId]: true }));
      
      // Get the DAO ID from the invitation
      const invitation = invitations.find((inv: UserInvitation) => inv.invitationId === invitationId);
      if (!invitation || !invitation.daoId) {
        throw new Error('Invalid invitation or missing DAO ID');
      }
      
      // Call the service with the correct parameters
      const action = accept ? 'accept' : 'decline';
      await daosService.respondToDAOInvitation(invitation.daoId, invitationId, action);
      
      // Remove the invitation from the list after successful response
      setInvitations((prevInvitations: UserInvitation[]) => 
        prevInvitations.filter((inv: UserInvitation) => inv.invitationId !== invitationId)
      );

      // Redirect to the DAO dashboard if the invitation was accepted
      if (accept && invitation.daoId) {
        onClose();
        navigate(`/daos/${invitation.daoId}`);
      }
    } catch (err) {
      console.error(`Error ${accept ? 'accepting' : 'declining'} invitation:`, err);
      setError(`Failed to ${accept ? 'accept' : 'decline'} invitation. Please try again.`);
    } finally {
      setActionLoading((prev: {[key: string]: boolean}) => ({ ...prev, [invitationId]: false }));
    }
  };

  const formatDate = (date?: Date): string => {
    if (!date) return 'Unknown date';
    
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    }).format(date);
  };

  const getTimeRemaining = (expiryDate?: Date): string => {
    if (!expiryDate) return 'No expiration';
    
    const now = new Date();
    
    if (expiryDate <= now) return 'Expired';
    
    const diffMs = expiryDate.getTime() - now.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} left`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} left`;
    } else {
      return 'Less than an hour left';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#1A1A1A] rounded-xl p-6 max-w-2xl w-full shadow-2xl border border-gray-700 max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className={typography.h2}>DAO Invitations</h2>
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
        
        <div className="overflow-y-auto flex-grow custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="w-12 h-12 border-t-2 border-b-2 border-indigo-500 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-400">Loading invitations...</p>
            </div>
          ) : invitations && invitations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Building size={48} className="text-gray-500 mb-4" />
              <p className={typography.h4 + " text-gray-300 mb-2"}>No Pending Invitations</p>
              <p className="text-gray-500 max-w-md">
                You don't have any pending DAO invitations. When someone invites you to join a DAO, it will appear here.
              </p>
            </div>
          ) : invitations && Array.isArray(invitations) ? (
            <div className="space-y-4">
              {invitations.map((invitation: UserInvitation) => (
                <div 
                  key={invitation.invitationId} 
                  className="bg-[#222]/80 border border-gray-700 rounded-lg p-4"
                >
                  <div className="flex justify-between mb-2">
                    <h3 className={typography.h3}>{invitation.daoName || 'DAO'}</h3>
                    <div className="flex items-center text-xs">
                      <Clock size={14} className="mr-1 text-indigo-400" />
                      <span className={invitation.expiresAt ? getTimeRemaining(invitation.expiresAt).includes('Expired') ? 'text-red-400' : 'text-indigo-400' : 'text-green-400'}>
                        {getTimeRemaining(invitation.expiresAt)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0 bg-indigo-900/30 rounded-full p-2 mr-3">
                      <Building size={16} className="text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-gray-300 mb-1">
                        Join this DAO to collaborate with other members.
                      </p>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar size={12} className="mr-1" />
                        <span>Invited: {formatDate(invitation.createdAt)}</span>
                        {invitation.inviterUsername && (
                          <span className="ml-2">by {invitation.inviterUsername}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {invitation.expiresAt && invitation.expiresAt <= new Date() ? (
                    <div className="bg-red-900/30 border border-red-500 rounded-md py-2 px-3 text-red-300 text-sm flex items-center">
                      <AlertCircle size={14} className="mr-2" />
                      <span>This invitation has expired</span>
                    </div>
                  ) : (
                    <div className="flex justify-end space-x-3">
                      <Button 
                        variant="secondary" 
                        size="small" 
                        onClick={() => handleInvitationResponse(invitation.invitationId || '', false)}
                        isLoading={actionLoading[invitation.invitationId || '']}
                        disabled={actionLoading[invitation.invitationId || '']}
                      >
                        Decline
                      </Button>
                      <Button 
                        variant="primary" 
                        size="small" 
                        onClick={() => handleInvitationResponse(invitation.invitationId || '', true)}
                        isLoading={actionLoading[invitation.invitationId || '']}
                        disabled={actionLoading[invitation.invitationId || '']}
                      >
                        Accept
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-yellow-500 flex items-center justify-center">
              <AlertCircle size={20} className="mr-2" />
              <span>Invalid invitation data format</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvitationsModal; 