import Cookies from "js-cookie";
import { COOKIE_KEYS } from "../constants";

const loginAction = async () => {
  Cookies.set(COOKIE_KEYS.isLogin, "1", { expires: 7 });
};

const logoutAction = async () => {
  Cookies.remove(COOKIE_KEYS.isLogin);
};

export { loginAction, logoutAction };
