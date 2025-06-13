import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

const useDistrict = (provinceCode) => {
  // Chỉ fetch dữ liệu khi có mã code tỉnh
  const { data, error, mutate } = useSWR(
    provinceCode ? `https://provinces.open-api.vn/api/p/${provinceCode}` : null,
    fetcher
  );

  return {
    districts: data,
    isLoading: !error && !data,
    isError: error,
    mutateDistrict: mutate,
  };
};

export default useDistrict;
