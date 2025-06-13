import { GatewayInstanceWithToken } from "../config";

export const fetchCarts = async () => {
  const response = await GatewayInstanceWithToken.get("carts");
  return response.data;
};

export const removeCartItem = async (id) => {
  const response = await GatewayInstanceWithToken.delete("carts/" + id);
  return response.data;
};

export const updateCartItem = async (data) => {
  const response = await GatewayInstanceWithToken.post("carts/update", {
    ...data,
  });
  return response.data;
};

export const selectedCartItem = async (id, isSelected) => {
  const response = await GatewayInstanceWithToken.post("carts/selected", {
    id,
    isSelected,
  });
  return response.data;
};
