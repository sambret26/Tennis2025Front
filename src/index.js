import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Importez BrowserRouter
import App from './App';
import './index.css';

// Sélectionnez l'élément racine de votre application
const container = document.getElementById('root');

// Créez une racine React
const root = createRoot(container);

// Rendez votre application enveloppée dans BrowserRouter
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);