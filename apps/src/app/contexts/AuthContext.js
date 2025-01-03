"use client";
import React, { createContext, useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { fetchUser, loginUser, registerUser } from "../actions/auth"; // Import các hành động
import { Spin } from "antd";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      fetchUser(storedToken)
        .then((userData) => setUser(userData))
        .catch((error) => {
          console.error("Error fetching user:", error);
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async ({ email, password }) => {
    try {
      setLoading(true);
      const data = await loginUser({ email, password });
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);
      data.user.role === "admin"
        ? router.push("/pages/admin")
        : router.push("/");
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // setUser(null);
    // setToken(null);
    // localStorage.removeItem("token");
    // router.push("/login");
  };

  const register = async (userInfo) => {
    try {
      setLoading(true);
      const data = await registerUser(userInfo);
      setUser(data.user);
      router.push("/pages/signin");
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        register,
        isAuthenticated: !!token,
      }}
    >
      {loading ? (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <Spin tip="Đang tải..." size="large" />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
