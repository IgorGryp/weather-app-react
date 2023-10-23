import React from 'react';
import './UnitsSwitcher.scss';

function UnitsSwitcher({ metricUnits, setMetricUnits }) {
  const toggleUnits = () => {
    setMetricUnits((prevMetricUnits) => !prevMetricUnits);
  };

  return (
    <div className="units-switcher-container">
      <button onClick={toggleUnits}>{metricUnits ? '°C' : '°F'}</button>
    </div>
  );
}

export default UnitsSwitcher;
