// src/components/HeaderComponent.jsx
import { useNavigate } from 'react-router-dom';
import '../assets/styles/HeaderComponent.css';

const HeaderComponent = () => {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="header-content" style={{cursor: 'pointer'}} onClick={() => navigate('/')}>
        <img src="/logo.png" alt="Logo" className="logo" />
        <h1>Pokebattle</h1>
      </div>
    </header>
  );
};

export default HeaderComponent;
