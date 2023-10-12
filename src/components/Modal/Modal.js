import React from 'react';
import cloudImg from '../../assets/cloud-01.png';
import crossImg from '../../assets/cross.png';
import './Modal.scss';

const Modal = ({ openModal, setOpenModal, setInputIsDisabled }) => {
  // If openModal is false no Modal is displayed.
  if (!openModal) return null;

  // Closes the Modal and enables input field when the Modal is closed by a user.
  const handleModal = () => {
    setOpenModal(false);
    setInputIsDisabled(false);
  };

  return (
    <div className="Modal">
      <div onClick={() => handleModal()} className="overlay">
        <div onClick={(e) => e.stopPropagation()} className="modal-container">
          <button onClick={() => handleModal()} className="close-modal-btn">
            <img className="cross-img" src={crossImg} alt="close modal button" />
          </button>
          <img src={cloudImg} className="modal-img" alt="no result found" />
          <p className="modal-msg">No result found</p>
        </div>
      </div>
    </div>
  );
};

export default Modal;
