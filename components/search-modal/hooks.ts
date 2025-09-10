import { useEffect } from 'react';

const useMonitorPathChange = (onChange: () => void) => {
  useEffect(() => {
    const handleRouteChange = () => {
      onChange();
    };

    window.addEventListener('popstate', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, [onChange]);
};

const useModalHistory = (isOpen: boolean, onClose: () => void) => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

  useEffect(() => {
    if (!isOpen || !isMobile) return;

    window.history.pushState({ modal: true }, '');

    const handlePopState = () => {
      // if the user presses back, close the modal
      onClose();
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);

      if (window.history.state?.modal) {
        window.history.back();
      }
    };
  }, [isOpen, onClose, isMobile]);
};

export { useModalHistory, useMonitorPathChange };
