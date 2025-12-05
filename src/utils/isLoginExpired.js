export const isLoginExpired = () => {
  const loginTimestamp = localStorage.getItem("loginTimestamp");
  if (!loginTimestamp) return true;
  const now = Date.now();
  const sevenDays = 7 * 24 * 60 * 60 * 1000;
  return now - loginTimestamp > sevenDays;
};
