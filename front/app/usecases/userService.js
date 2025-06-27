import { API_BASE_ROUTE } from "../env.js";
import { SESSION_ID_KEY } from "../scripts/consts.js";

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

const doesUserNameExists = async (username) => {
  const result = await fetch(`${API_BASE_ROUTE}/users/${username}/exists`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
  });

  const resultBody = await result.json();
  const { exists } = resultBody;

  return exists;
};

const doesEmailExists = async (email) => {
  const result = await fetch(`${API_BASE_ROUTE}/users/exists`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ email }),
  });

  const resultBody = await result.json();
  const { exists } = resultBody;

  return exists;
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
  const sessionId = sessionStorage.getItem(SESSION_ID_KEY);
  return fetch(`${API_BASE_ROUTE}/users/images`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionId}`,
    },
    body: JSON.stringify({
      filename,
      image,
    }),
  });
};

const getMyImages = async () => {
  const sessionId = sessionStorage.getItem(SESSION_ID_KEY);
  return fetch(`${API_BASE_ROUTE}/users/images`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionId}`,
    },
  });
};

const updateUserInfos = async (updateUserInfosRequest) => {
  const sessionId = sessionStorage.getItem(SESSION_ID_KEY);
  return fetch(`${API_BASE_ROUTE}/users/${sessionId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionId}`,
    },
    method: "PATCH",
    body: JSON.stringify({ ...updateUserInfosRequest }),
  });
};

const likeOrDisLikeImage = async (imageId) => {
  const sessionId = sessionStorage.getItem(SESSION_ID_KEY);
  return fetch(`${API_BASE_ROUTE}/users/images/${imageId}/likes`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionId}`,
    },
    method: "POST",
  });
};

const commentImage = async (imageId, comment) => {
  const sessionId = sessionStorage.getItem(SESSION_ID_KEY);
  return fetch(`${API_BASE_ROUTE}/users/images/${imageId}/comment`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionId}`,
    },
    method: "POST",
    body: JSON.stringify({ comment }),
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
  getMyImages,
  updatePassword,
  updateUserInfos,
  likeOrDisLikeImage,
  commentImage,
  doesUserNameExists,
  doesEmailExists,
};
