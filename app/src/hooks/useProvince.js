import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

const useProvince = () => {
  const { data, error } = useSWR(
    "https://provinces.open-api.vn/api/p/",
    fetcher
  );

  return {
    provinces: data, // Dữ liệu tỉnh/thành phố
    isLoading: !data && !error, // Trạng thái đang tải
    isError: error, // Trạng thái lỗi nếu có
  };
};

export default useProvince;
