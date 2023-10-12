import React from 'react';
import pinImg from '../../assets/location.png';
import './LocationButton.scss';

function LocationButton({ searchUserLacation }) {
  return (
    <div className="LocationButton" onClick={() => searchUserLacation()}>
      <img src={pinImg} className="location-pin" alt="location pin"></img>
    </div>
  );
}

export default LocationButton;
