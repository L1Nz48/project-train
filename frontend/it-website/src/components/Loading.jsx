// Loading.jsx
import React from 'react';
import '../Loading.css';

function Loading() {
  return (
    <div className="loading-overlay">
      <div className="loading-container">
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