import api from "./axios";

export const loginApi = async (email: string, password: string) => {
  const res = await api.post("/api/auth/login", { email, password });
  console.log("LOGIN RESPONSE 👉", res.data);
  return res.data;
};

export const registerApi = async (
  name: string,
  email: string,
  password: string
) => {
  const res = await api.post("/api/auth/register", {
    name,
    email,
    password,
  });
  return res.data;
};

export const logoutApi = async () => {
  const res = await api.post("/api/auth/logout");
  return res.data;
};