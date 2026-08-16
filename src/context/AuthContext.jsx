import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [name, setName] = useState(() => localStorage.getItem('userName') || null);

  function login(newToken, newName) {
    localStorage.setItem('token', newToken);
    localStorage.setItem('userName', newName);
    setToken(newToken);
    setName(newName);
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    setToken(null);
    setName(null);
  }

  return (
    <AuthContext.Provider value={{ token, name, isLoggedIn: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
