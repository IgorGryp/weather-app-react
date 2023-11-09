import React from 'react';
import './UnitsSwitcher.scss';
import switcherImg from '../../assets/switcher.png';

function UnitsSwitcher({ metricUnits, setMetricUnits }) {
  const toggleUnits = () => {
    setMetricUnits((prevMetricUnits) => !prevMetricUnits);
  };

  return (
    <div className="units-switcher-container">
      <button onClick={toggleUnits}>
        <img src={switcherImg} alt="units switcher" className="switcher-img" />
        {metricUnits ? '°F' : '°C'}
      </button>
    </div>
  );
}

export default UnitsSwitcher;
