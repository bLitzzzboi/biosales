import React from 'react';

const ImagePreview = ({ url, children }) => {
  const handleLinkClick = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div>
      <button onClick={handleLinkClick}>
        {children}
      </button>
    </div>
  );
};

export default ImagePreview;
