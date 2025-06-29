export const saveAuthData = (token: string, id:number, userName: string, nombreCompleto: string): void => {
  localStorage.setItem('token', token);
  localStorage.setItem('userName', userName);
  localStorage.setItem('nombre', nombreCompleto);
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
};
