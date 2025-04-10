import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useAuthCallback = () => {
  const location = useLocation();
  const [showProfileModal, setShowProfileModal] = useState(false);
  
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    
    if (searchParams.has('success') || searchParams.has('error')) {
      setShowProfileModal(true);
    }
  }, [location.search]);
  
  return {
    showProfileModal,
    hideProfileModal: () => setShowProfileModal(false)
  };
};

export default useAuthCallback; 