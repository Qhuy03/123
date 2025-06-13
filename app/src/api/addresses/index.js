// api/addresses.js

import { GatewayInstanceWithToken } from "../config";

export const fetchAddresses = async () => {
  const response = await GatewayInstanceWithToken("address");
  return response.data;
};

export const updateAddressById = async (id, updatedData) => {
  const response = await GatewayInstanceWithToken.post(
    `address/update`,
    updatedData
  );
  return response.data;
};

export const createAddress = async (newData) => {
  const response = await GatewayInstanceWithToken.post("address", newData);
  return response.data;
};
