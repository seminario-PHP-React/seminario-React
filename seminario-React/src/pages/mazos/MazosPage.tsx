import React from 'react';
import '../../assets/styles/MazosPage.css';

const MazosPage: React.FC = () => {
  //const nombre = localStorage.getItem('nombre') || 'Entrenador';
  return (
    <div className="mazos-page-bg">
      <img src="/assets/images/arcoiris.jpg" alt="Arcoiris" className="mazos-arcoiris-img" />
      <div className="mazos-card">
        <h1>¡Bienvenido, Entrenador!</h1>
        <p>Aquí podrás ver y gestionar tus mazos de cartas Pokémon.</p>
        <img src="/assets/images/pikachu2.jpg" alt="Pokémon" className="mazos-img" />
      </div>
    </div>
  );
};

export default MazosPage; 