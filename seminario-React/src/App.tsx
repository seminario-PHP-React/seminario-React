import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavBarComponent from './components/NavBarComponent';

import RegistroPage from './pages/registro/RegistroPage';
import LoginComponent from './pages/login/LoginComponent';
import EditarUsuarioPage from './pages/editar/EditarUsuarioPage';
import MazosPage from './pages/mazos/MazosPage';
import JugarPage from './pages/mazos/JugarPage';
import StatPage from './pages/stat/StatPage';



const App: React.FC = () => {
  return (
    <Router>
      <div>
        <NavBarComponent /> {/* se muestra en todas las paginas */}
        

        <Routes> 
          <Route path="/" element={<Navigate to="/estadisticas" replace />} />
          <Route path="/login" element={<LoginComponent />} />
          <Route path="/registro" element={<RegistroPage />} />
          <Route path="/estadisticas" element={<StatPage />} />
          <Route path="/editar-usuario" element={<EditarUsuarioPage />} />
          <Route path="/mis-mazos" element={<MazosPage />} />
          <Route path="/jugar/:mazoId" element={<JugarPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
