import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Modal from './Modal';
import '@assets/styles/index.css';

document.getElementById('root') &&
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );

document.getElementById('modal') &&
  ReactDOM.createRoot(document.getElementById('modal')!).render(
    <React.StrictMode>
      <Modal />
    </React.StrictMode>,
  );

// Use contextBridge
window.electron.ipcRenderer.on('main-process-message', (_event, message) => {
  console.log(message);
});
