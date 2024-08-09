import React from 'react';
import './Modal.css'; // Assuming you have a CSS file for styling

const Modal = ({ isOpen, onClose, children, imageUrl }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>
          &times;
        </button>
        {imageUrl ? (
          <div className="image-preview">
            <img src={imageUrl} alt="Preview" />
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};

export default Modal;
