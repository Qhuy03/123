// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";
import { AuthInstance, AuthInstanceWithToken } from "../api/config";

// Tạo AuthContext
export const AuthContext = createContext(null);

// Tạo Auth Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hàm kiểm tra xem người dùng đã đăng nhập chưa khi tải trang
  useEffect(() => {
    const initAuth = async () => {
      try {
        const user_id = Cookies.get("user_id");
        console.log(user_id);
        // Nếu có user_id, thử lấy thông tin người dùng
        if (user_id) {
          const userData = await fetchUserData();
          setUser(userData);
        }
      } catch (err) {
        console.error("Error initializing auth:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Hàm để lấy thông tin người dùng từ server
  const fetchUserData = async () => {
    try {
      const response = await AuthInstanceWithToken.post(
        "/users/authenticated",
        null,
        {
          withCredentials: true,
        }
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  };

  // Hàm login
  const login = async (data) => {
    try {
      setLoading(true);
      const response = await AuthInstance.post("/users/login", data, {
        withCredentials: true,
      });
      // Lưu tokens vào cookies
      const { user_id, refresh_token, token } = response.data.data;
      console.log(response);
      // Lưu Access Token với thời gian ngắn hơn (ví dụ: 15 phút)
      Cookies.set("user_id", user_id, {
        expires: 7, // 15 phút
        secure: true,
        sameSite: "strict",
      });

      Cookies.set("refresh_token", refresh_token, {
        expires: 7, // 15 phút
        secure: true,
        sameSite: "strict",
      });

      Cookies.set("token", token, {
        expires: 7, // 15 phút
        secure: true,
        sameSite: "strict",
      });

      // Lấy thông tin người dùng
      const userData = await fetchUserData();
      console.log(userData);
      setUser(userData);
      window.location.href = "/";
      // Chuyển hướng đến trang chính sau khi đăng nhập thành công

      return userData;
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Đăng nhập thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Hàm đăng xuất
  const logout = () => {
    // Xóa cookies
    Cookies.remove("user_id");

    // Xóa state
    setUser(null);
  };

  // Giá trị được cung cấp cho context
  const authContextValue = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook để sử dụng AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth phải được sử dụng trong AuthProvider");
  }
  return context;
};
