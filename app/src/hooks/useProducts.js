import useSWR from "swr";
import { fetchProductDetail, fetchProducts } from "../api/products";

const fetcher = async (url) => {
  const category = url.split("/").pop();
  const data = await fetchProducts(category === "products" ? null : category);
  return data;
};

const useProducts = (id, config) => {
  const { data, error, isLoading } = useSWR(
    id ? "/products/" + id : "/products",
    fetcher,
    config
  );

  const getProductDetail = async (id) => {
    return await fetchProductDetail(id);
  };

  return {
    products: data,
    isLoading,
    error,
    getProductDetail,
  };
};

export default useProducts;
