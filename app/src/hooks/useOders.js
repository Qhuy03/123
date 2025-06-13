import useSWR from "swr";
import { fetchProductDetail, fetchProducts } from "../api/products";
import { GatewayInstanceWithToken } from "../api/config";

const useOders = (id, config) => {
  const { data, error, isLoading } = useSWR(
    id ? "/checkout/orders/" + id : "/checkout/orders",
    async (url) => {
      const data = await GatewayInstanceWithToken.get(url);
      return data.data?.data;
    },
    config
  );

  return {
    orders: data,
    isLoading,
    error,
  };
};

export default useOders;
