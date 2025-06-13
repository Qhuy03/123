// Lấy danh sách sản phẩm

import { ProductInstance } from "../config";

export const fetchProducts = async (category) => {
  let url = "/spus";
  if (category) url = "/spus?category=" + category;
  const response = await ProductInstance.get(url);
  return response.data;
};

export const fetchProductDetail = async (id) => {
  const response = await ProductInstance.get("/spus/" + id);
  return response.data;
};
