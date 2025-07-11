export const saveAuthData = (token: string, id:number, userName: string): void => {
  localStorage.setItem('token', token);
  localStorage.setItem('userName', userName);
  localStorage.setItem('usuario', JSON.stringify({ token, id }));
};


export const getToken = () => {
  return localStorage.getItem('token');
};

export const getUserName = () => {
  return localStorage.getItem('userName');
};

export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userName');
  localStorage.removeItem('usuario');
};

// Función para limpiar TODO el localStorage
export const clearAllLocalStorage = () => {
  localStorage.clear();
};
