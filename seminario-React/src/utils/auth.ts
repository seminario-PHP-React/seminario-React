export const saveAuthData = (token: string, userName: string): void => {
  localStorage.setItem('token', token);
  localStorage.setItem('userName', userName);
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
