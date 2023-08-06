import React from 'react';
import cloudImg from '../assets/cloud-01.png';
import crossImg from '../assets/cross-02.png';

const Modal = ({ openModal, setOpenModal }) => {
  if (openModal === false) return null;

  return (
    <div className='overlay'>
      <div className='modalContainer'>
        <img src={cloudImg} className='modalImg' alt='no result found' />
        <p className='modalMsg'>No result found</p>
        <button onClick={() => setOpenModal(false)} className='closeModalBtn'>
          <img
            className='crossImg'
            src={crossImg}
            alt='close modal button'
          ></img>
        </button>
      </div>
    </div>
  );
};

export default Modal;
