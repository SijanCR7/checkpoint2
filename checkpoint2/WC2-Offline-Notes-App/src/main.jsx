import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      await navigator.serviceWorker.register('/service-worker.js');
      await navigator.serviceWorker.ready;
      window.dispatchEvent(new CustomEvent('offline-notes:service-worker', {
        detail: 'Offline support is active.',
      }));
    } catch (error) {
      console.error('Service worker registration failed.', error);
      window.dispatchEvent(new CustomEvent('offline-notes:service-worker', {
        detail: 'Offline support could not be enabled. Check the browser console.',
      }));
    }
  });
} else {
  window.dispatchEvent(new CustomEvent('offline-notes:service-worker', {
    detail: 'This browser does not support service workers.',
  }));
}
