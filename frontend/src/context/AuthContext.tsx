import { createContext, useContext, useState, PropsWithChildren } from "react";
import { loginApi, registerApi, logoutApi } from "../api/auth.api";

type User = {
  _id: string;
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

// 🔥 normalize backend user shape ONCE
const normalizeUser = (data: any): User => {
  const raw = data.user ?? data;

  return {
    _id: raw._id || raw.id,   // 👈 THIS IS THE KEY FIX
    name: raw.name,
    email: raw.email,
  };
};

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    const data = await loginApi(email, password);
    setUser(normalizeUser(data));
  };

  const register = async (name: string, email: string, password: string) => {
    const data = await registerApi(name, email, password);
    setUser(normalizeUser(data));
  };

  const logout = async () => {
    await logoutApi();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
