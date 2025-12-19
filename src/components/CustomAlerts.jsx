import React, { useState } from 'react';
import { useSnackbar } from 'notistack';

function CustomAlerts() {
  const { enqueueSnackbar } = useSnackbar();
  const [alertCondition, setAlertCondition] = useState('');

  const handleSetAlert = () => {
    enqueueSnackbar(`Alert set for condition: ${alertCondition}`, { variant: 'success' });
  };

  return (
    <div>
      <h3>Set Custom Weather Alerts</h3>
      <input
        type="text"
        value={alertCondition}
        onChange={(e) => setAlertCondition(e.target.value)}
        placeholder="e.g., Temperature > 30°C"
      />
      <button onClick={handleSetAlert}>Set Alert</button>
    </div>
  );
}

export default CustomAlerts;
