import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBarComponent from './components/NavBarComponent';
import LoginComponent from './components/LoginComponent';


const App: React.FC = () => {
  return (
    <Router>
      <div>
        <NavBarComponent /> {/* se muestra en todas las paginas */}
        

        <Routes> 
          <Route path="/" element={<div>Página de Inicio</div>} />
          <Route path="/login" element={<LoginComponent />} />
          <Route path="/mis-mazos" element={<div>Mis Mazos</div>} />
          <Route path="/editar-usuario" element={<div>Editar Usuario</div>} />
          
        </Routes>
      </div>
    </Router>
  );
};

export default App;
