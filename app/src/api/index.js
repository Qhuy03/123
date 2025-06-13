import axios from "axios";
import { COOKIE_KEYS, LOCAL_STORAGE_KEYS } from "../constants/index";
import Cookies from "js-cookie";

export function getCookie(name) {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];
}

const MAX_REFRESH_ATTEMPT = 3;

export class AppNetwork {
  constructor(baseURL) {
    this.countOfRefreshAttems = 0;
    this.failedRequestQueue = [];
    this.__isRefresing = false;
    this.__refresh_token_promise = null;

    this.axiosInstance = axios.create({ baseURL });
    this.axiosWithToken = axios.create({ baseURL });

    // Handle before every request
    this.axiosWithToken.interceptors.request.use(
      this.addTokensBeforeRequest.bind(this),
      undefined
    );

    // Handle after every failed request
    this.axiosWithToken.interceptors.response.use(
      undefined,
      this.handleErrorRequest.bind(this)
    );
  }

  /**
   * Axios interceptor handler, run after every failed requests
   *
   * @param {*} error
   * @return {*}
   * @memberof AppNetwork
   */
  async handleErrorRequest(error) {
    const status = error.response?.status;
    const originalRequest = error.config;
    if (status === 401) {
      return new Promise((resolve, reject) => {
        if (this.countOfRefreshAttems > MAX_REFRESH_ATTEMPT) {
          return reject();
        }
        this.tryRefresh(originalRequest)
          .then(resolve)
          .catch((err) => {
            // show re-auth page
            Cookies.remove("user_id");
            Cookies.remove("token");
            Cookies.remove("refresh_token");
            return (window.location.href = "/login");
          });
      });
    }

    return Promise.reject(error);
  }

  /**
   * Axios interceptor handler, run before every request
   *
   * @param {*} config
   * @return {*}
   * @memberof AppNetwork
   */
  addTokensBeforeRequest(config) {
    config.headers.Authorization = `Bearer ${localStorage.getItem(
      LOCAL_STORAGE_KEYS.at
    )}`;
    config.headers["x-client-id"] = getCookie("user_id");
    return config;
  }

  /**
   * In case 401 error, handle refresh token
   *
   * @param {*} originalRequest
   * @memberof AppNetwork
   */
  async tryRefresh(originalRequest) {
    this.countOfRefreshAttems = this.countOfRefreshAttems + 1;
    if (!this.__isRefresing) {
      this.__refresh_token_promise = this.refreshToken();
    }

    await this.__refresh_token_promise;

    return this.axiosWithToken(originalRequest);
  }

  /* Call API refresh token */
  async refreshToken() {
    const _refresh_token = getCookie(COOKIE_KEYS.rf);
    if (_refresh_token) {
      // const { data } = await this.axiosInstance({
      //   method: "POST",
      //   url: "/users/refresh",
      // });
      // return data;
    }
  }
}
