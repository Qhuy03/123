import useSWR from "swr";
import {
  fetchCarts,
  removeCartItem,
  selectedCartItem,
  updateCartItem,
} from "../api/carts";
import { toast } from "react-toastify";

const fetcher = async () => {
  const data = await fetchCarts();
  return data.data;
};

const useCarts = (config) => {
  const { data, error, isLoading, mutate } = useSWR("/carts", fetcher, config);

  const handleRemove = async (id) => {
    await removeCartItem(id);
    mutate();
  };

  const handlePlus = async (data) => {
    try {
      await updateCartItem(data);
      mutate();
    } catch (error) {
      toast.error(error?.message);
    }
  };

  const handleMinus = async (data) => {
    try {
      await updateCartItem(data);
      mutate();
    } catch (error) {
      toast.error(error?.message);
    }
  };

  const handleSelected = async (id, isSelected) => {
    try {
      await selectedCartItem(id, isSelected);
      mutate();
    } catch (error) {
      toast.error(error?.message);
    }
  };

  return {
    carts: data,
    isLoading,
    error,
    handleRemove,
    handlePlus,
    handleMinus,
    handleSelected,
  };
};

export default useCarts;
