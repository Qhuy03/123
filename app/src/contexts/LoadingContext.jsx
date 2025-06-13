import { createContext, useContext, useState } from "react";

// Tạo context với giá trị mặc định
const LoadingContext = createContext(undefined);

// Tạo Provider để quản lý trạng thái loading

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);

  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);

  return (
    <LoadingContext.Provider value={{ loading, startLoading, stopLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);

  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }

  return context;
};
