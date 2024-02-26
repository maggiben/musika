import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '@assets/styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Use contextBridge
window.electron.ipcRenderer.on('main-process-message', (_event, message) => {
  console.log(message);
});
