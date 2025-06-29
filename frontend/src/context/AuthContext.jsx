import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !user) {
      axios.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        setUser({ ...res.data, token });
      }).catch(() => {
        localStorage.removeItem("token");
        setUser(null);
      });
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
