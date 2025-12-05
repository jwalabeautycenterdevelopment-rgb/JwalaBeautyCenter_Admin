import { logout, refreshToken } from "../store/slice/login";

let refreshTimeout;
export const isLoginExpired = () => {
  const loginTimestamp = localStorage.getItem("loginTimestamp");
  if (!loginTimestamp) return true;
  const now = Date.now();
  const sevenDays = 7 * 24 * 60 * 60 * 1000;
  return now - Number(loginTimestamp) > sevenDays;
};

export const setupTokenRefresh = () => {
  if (isLoginExpired()) {
    localStorage.clear();
    store.dispatch(logout());
    return;
  }
  const tokenExpiry = localStorage.getItem("tokenExpiry");
  if (!tokenExpiry) return;
  const currentTime = Date.now();
  const expiresIn = Number(tokenExpiry) - currentTime;
  const refreshIn = expiresIn - 2 * 60 * 1000;
  clearTimeout(refreshTimeout);

  if (refreshIn <= 0) {
    store.dispatch(refreshToken());
  } else {
    refreshTimeout = setTimeout(() => {
      store.dispatch(refreshToken());
    }, refreshIn);
  }
};

export const clearTokenRefresh = () => {
  clearTimeout(refreshTimeout);
};
