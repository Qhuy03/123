import { AppNetwork } from "..";

export const {
  axiosInstance: ProductInstance,
  axiosWithToken: ProductInstanceWithToken,
} = new AppNetwork(
  "http://localhost:3008"
  // "http://localhost/tcp"
  // "http://192.168.1.161:3008/"
);

export const {
  axiosInstance: AuthInstance,
  axiosWithToken: AuthInstanceWithToken,
} = new AppNetwork("http://localhost:8080");

export const {
  axiosInstance: CartsInstance,
  axiosWithToken: CartsInstanceWithToken,
} = new AppNetwork("http://localhost:8080");

export const { axiosWithToken: GatewayInstanceWithToken } = new AppNetwork(
  "http://localhost:8080"
);
