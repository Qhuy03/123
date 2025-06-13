import useSWR from "swr";
import { toast } from "react-toastify";
import { GatewayInstanceWithToken } from "../api/config";

// Fetcher function để lấy dữ liệu địa chỉ
const fetcher = async () => {
  const response = await GatewayInstanceWithToken.get("/settings/payment");
  return response.data;
};

const usePayments = (config) => {
  // Lấy dữ liệu địa chỉ với SWR
  const { data, error, isLoading, mutate } = useSWR(
    "/settings/payment",
    fetcher,
    config
  );

  return {
    payments: data,
    isLoading,
    error,
  };
};

export default usePayments;
