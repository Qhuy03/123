import { ProductInstance } from "../config";

export const fetchCategories = async (parent_id = undefined) => {
  let url = "/categories/parent";
  if (parent_id !== undefined) {
    url = `/categories/parent/${parent_id}`;
  }
  const response = await ProductInstance.get(url);
  return response.data;
};
