import { createContext, useContext, useState, useEffect } from "react";
import axios from "../utils/axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Call this from your login page
  const login = async ({ email, password }) => {
    // 1) Authenticate and get token
    const { data: { access_token } } = await axios.post("/auth/login", { email, password });
    localStorage.setItem("token", access_token);

    // 2) Fetch the user profile
    const { data: me } = await axios.get("/auth/me", {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    setUser(me);
    localStorage.setItem("user", JSON.stringify(me));
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  // On mount, rehydrate user if token exists
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("/auth/me", { headers: { Authorization: `Bearer ${token}` } })
        .then(({ data: me }) => {
          setUser(me);
        })
        .catch(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
