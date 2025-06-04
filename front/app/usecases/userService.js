import { API_BASE_ROUTE } from "../env.js";

const register = async (user) => {
  return fetch(`${API_BASE_ROUTE}/auth/register`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(user),
  });
};

const verify = async (token) => {
  return fetch(`${API_BASE_ROUTE}/auth/verify/${token}`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });
};

const signIn = async (username, passwd) => {
  return fetch(`${API_BASE_ROUTE}/auth/login`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ username, passwd }),
  });
};

const isAuth = async () => {};

const getMe = async (sessionId) => {
  return fetch(`${API_BASE_ROUTE}/users/${sessionId}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
  });
};

const logout = async (sessionId) => {
  return fetch(`${API_BASE_ROUTE}/auth/logout/${sessionId}`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "PATCH",
  });
};

const sendResetPasswordRequest = async (email) => {
  return fetch(`${API_BASE_ROUTE}/auth/reset-password`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ email }),
  });
};

const uploadImage = async (filename, image) => {
  return fetch("/api/v1/users/images", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      filename,
      image,
    }),
  });
};

export const userService = {
  register,
  verify,
  signIn,
  getMe,
  isAuth,
  logout,
  sendResetPasswordRequest,
  uploadImage,
};
