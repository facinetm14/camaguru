import { API_BASE_ROUTE } from "../env.js";
import { SESSION_ID_KEY } from "../scripts/consts.js";

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

const findAllUsersImages = async () => {
  return fetch(`${API_BASE_ROUTE}/users/images`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
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

const deleteUserImage = async (imageId) => {
  const sessionId = sessionStorage.getItem(SESSION_ID_KEY);
  return fetch(`${API_BASE_ROUTE}/users/images/${imageId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionId}`,
    },
    method: "DELETE",
  });
};

export const userApi = {
  getMe,
  uploadImage,
  findAllUsersImages,
  updateUserInfos,
  likeOrDisLikeImage,
  commentImage,
  doesUserNameExists,
  doesEmailExists,
  deleteUserImage,
};
