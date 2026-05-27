import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Clinic from './Clinic.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Clinic />
  </React.StrictMode>
);
