import React from 'react';
import cloudImg from '../assets/cloud-01.png';
import crossImg from '../assets/cross.png';

const Modal = ({ openModal, setOpenModal, setInputIsDisabled }) => {
  // If openModal is false no Modal is displayed.
  if (!openModal) return null;

  // Closes the Modal and enables input field when the Modal is closed by a user.
  const handleModal = () => {
    setOpenModal(false);
    setInputIsDisabled(false);
  };

  return (
    <div>
      <div onClick={() => handleModal()} className="overlay">
        <div onClick={(e) => e.stopPropagation()} className="modalContainer">
          <button onClick={() => handleModal()} className="closeModalBtn">
            <img className="crossImg" src={crossImg} alt="close modal button" />
          </button>
          <img src={cloudImg} className="modalImg" alt="no result found" />
          <p className="modalMsg">No result found</p>
        </div>
      </div>
    </div>
  );
};

export default Modal;
