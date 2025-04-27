import React, { useEffect } from 'react';
import { toast } from 'react-toastify';

function Loading() {
  useEffect(() => {
    const timer = setTimeout(() => {
      toast.error('การโหลดล้มเหลว กรุณาลองใหม่', { position: 'top-right' });
    }, 30000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="loading-overlay">
      <div className="loading-container" role="status" aria-live="polite">
        <div className="spinner">
          <div className="circle circle-1"></div>
          <div className="circle circle-2"></div>
          <div className="circle circle-3"></div>
        </div>
        <h3 className="loading-text">กำลังโหลด...</h3>
      </div>
    </div>
  );
}

export default Loading;