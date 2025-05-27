export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem("token");
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("email");
  window.location.href = "/login";
};