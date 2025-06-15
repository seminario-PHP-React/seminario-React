// src/components/HeaderComponent.jsx
import React from 'react';
import './HeaderComponent.css';
import { useNavigate } from 'react-router-dom';
import 'src/assets/styles/HeaderComponent.css';




const HeaderComponent = () => {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="header-content" onClick={() => navigate('/')}>
        <img src="/logo.png" alt="Logo" className="logo" />
        <h1>Pokebattle</h1>
      </div>
    </header>
  );
};

export default HeaderComponent;
