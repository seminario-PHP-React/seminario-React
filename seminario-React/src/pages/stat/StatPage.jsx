// src/pages/stat/StatPage.jsx
// @ts-nocheck
import React, { useEffect, useState } from 'react';
import '../../assets/styles/StatPage.css';

const PAGE_SIZE = 5;

const StatPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [orden, setOrden] = useState('mejor'); // 'mejor' o 'peor'
  const [pagina, setPagina] = useState(1);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      setCargando(true);
      setError(null);
      try {
        const res = await fetch('http://localhost:8000/estadisticas', {
          headers: { 'x-api-key': 'abc123' }
        });
        if (!res.ok) throw new Error('No se pudieron obtener las estadísticas');
        const data = await res.json();
        // Suponemos que data es un array de usuarios con stats
        setUsuarios(Array.isArray(data) ? data : (data.usuarios || []));
      } catch (e) {
        setError(e.message || 'Error desconocido');
      } finally {
        setCargando(false);
      }
    };
    fetchStats();
  }, []);

  // Calcular promedio y ordenar
  const usuariosConPromedio = usuarios.map(u => {
    const jugadas = Number(u['Partidas jugadas']) || 0;
    const ganadas = Number(u['Victorias']) || 0;
    const perdidas = Number(u['Derrotas']) || 0;
    const empatadas = Number(u['Empates']) || 0;
    return {
      ...u,
      jugadas,
      ganadas,
      perdidas,
      empatadas,
      promedio: jugadas > 0 ? ganadas / jugadas : 0
    };
  });
  const usuariosOrdenados = [...usuariosConPromedio].sort((a, b) => {
    if (orden === 'mejor') return b.promedio - a.promedio;
    return a.promedio - b.promedio;
  });

  // Paginado
  const totalPaginas = Math.ceil(usuariosOrdenados.length / PAGE_SIZE);
  const usuariosPagina = usuariosOrdenados.slice((pagina - 1) * PAGE_SIZE, pagina * PAGE_SIZE);
  const mejorPromedio = usuariosOrdenados[0]?.promedio;

  return (
    <div className="stat-container">
      <h1>Estadísticas de Pokebattle</h1>
      <div className="stat-orden">
        <button
          className={orden === 'mejor' ? 'activo' : ''}
          onClick={() => { setOrden('mejor'); setPagina(1); }}
        >Mejor performance</button>
        <button
          className={orden === 'peor' ? 'activo' : ''}
          onClick={() => { setOrden('peor'); setPagina(1); }}
        >Peor performance</button>
      </div>
      {cargando && <p>Cargando estadísticas...</p>}
      {error && <p style={{color:'red'}}>{error}</p>}
      <table className="stat-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Partidas</th>
            <th>Ganadas</th>
            <th>Perdidas</th>
            <th>Empatadas</th>
            <th>Promedio ganadas</th>
          </tr>
        </thead>
        <tbody>
          {usuariosPagina.map((u, i) => (
            <tr key={u.Nombre}
                className={u.promedio === mejorPromedio && orden === 'mejor' && pagina === 1 && i === 0 ? 'mejor' : ''}>
              <td>{u.Nombre}</td>
              <td>{u.jugadas}</td>
              <td>{u.ganadas}</td>
              <td>{u.perdidas}</td>
              <td>{u.empatadas}</td>
              <td>{(u.promedio * 100).toFixed(1)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="stat-paginado">
        <button onClick={() => setPagina(p => Math.max(1, p - 1))} disabled={pagina === 1}>Anterior</button>
        <span>Página {pagina} de {totalPaginas}</span>
        <button onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))} disabled={pagina === totalPaginas}>Siguiente</button>
      </div>
    </div>
  );
};

export default StatPage;
