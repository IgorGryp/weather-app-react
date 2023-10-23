import React from 'react';

function UnitsSwitcher({ metricUnits, setMetricUnits }) {
  const toggleUnits = () => {
    setMetricUnits((prevMetricUnits) => !prevMetricUnits);
  };

  return (
    <div>
      <button onClick={toggleUnits}>{metricUnits ? 'Imperial' : 'Metric'}</button>
    </div>
  );
}

export default UnitsSwitcher;
