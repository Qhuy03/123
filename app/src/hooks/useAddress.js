import useSWR from "swr";
import {
  fetchAddresses,
  updateAddressById,
  createAddress,
} from "../api/addresses";
import { toast } from "react-toastify";

// Fetcher function để lấy dữ liệu địa chỉ
const fetcher = async () => {
  const data = await fetchAddresses();
  return data.data;
};

const useAddress = (config) => {
  // Lấy dữ liệu địa chỉ với SWR
  const { data, error, isLoading, mutate } = useSWR(
    "/addresses",
    fetcher,
    config
  );

  // Hàm cập nhật địa chỉ theo ID
  const handleUpdate = async (id, updatedData) => {
    try {
      await updateAddressById(id, updatedData);
      mutate(); // Cập nhật dữ liệu mới sau khi thay đổi
    } catch (error) {
      toast.error(error?.message);
    }
  };

  // Hàm tạo mới địa chỉ
  const handleCreate = async (newData) => {
    try {
      await createAddress(newData);
      mutate(); // Cập nhật dữ liệu sau khi tạo mới
      toast.success("Address created successfully!");
    } catch (error) {
      toast.error(error?.message);
    }
  };

  return {
    addresses: data,
    isLoading,
    error,
    handleUpdate,
    handleCreate,
  };
};

export default useAddress;
