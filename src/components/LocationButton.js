import React from 'react';
import pinImg from '../assets/location.png';

function LocationButton({ searchUserLacation }) {
  return (
    <div className="location-pin-container" onClick={() => searchUserLacation()}>
      <img src={pinImg} className="location-pin" alt="location pin"></img>
    </div>
  );
}

export default LocationButton;
