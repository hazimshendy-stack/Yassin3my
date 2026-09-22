import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles/globals.css';
import './styles/utilities.css';

const el = document.getElementById('root');
if (!el) {
  console.error('#root element was not found.');
} else {
  createRoot(el).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
