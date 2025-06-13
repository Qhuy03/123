import useSWR from "swr";
import { fetchCategories } from "../api/categories";

const fetcher = async (url) => {
  const parent_id = url.split("/").pop();
  const data = await fetchCategories(
    parent_id === "categories" ? undefined : parent_id
  );
  return data;
};

const useCategories = (parent_id, config) => {
  const { data, error, isLoading } = useSWR(
    parent_id ? `/categories/${parent_id}` : "/categories",
    fetcher,
    config
  );

  return {
    categories: data,
    isLoading,
    error,
  };
};

export default useCategories;
