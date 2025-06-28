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

const updatePassword = async (id, passwd) => {
  return fetch(`${API_BASE_ROUTE}/auth/new-password`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "PATCH",
    body: JSON.stringify({ passwd, id }),
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


export const authApi = {
  register,
  verify,
  updatePassword,
  signIn,
  logout,
  sendResetPasswordRequest
}