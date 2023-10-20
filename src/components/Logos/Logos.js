import React from 'react';
import logosImg from '../../assets/clients-logos.png';
import logosImg2 from '../../assets/clients-logos-2.png';
import './Logos.scss';

function Logos() {
  return (
    <section className="logos-section">
      <div className="logos-container">
        <div className="logos">
          <img alt="Own clients logos" src={logosImg} />
        </div>
        <div className="logos logos-2">
          <img alt="Own clients logos" src={logosImg2} />
        </div>
      </div>
    </section>
  );
}

export default Logos;
