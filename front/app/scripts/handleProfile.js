import { userService } from "../../usecases/userService.js";
import userStore from "../../scripts/userStore.js";
import { navigate } from "./events.js";

// layouts binding
const logoutBtn = document.querySelector("#logout");
const profileDropdownMenu = document.querySelector("#profile-dropdownMenu");
const usernameLabel = document.querySelector("#username-label");
const sessionId = sessionStorage.getItem("sessionId");
const addImageBtn = document.querySelector("#btn-add-image");
const selfieBlock = document.querySelector("#block-selfie");
const takePhotoBtn = document.querySelector("#take-photo");
const closePhotoBtn = document.querySelector("#close-photo");
const canvas = document.querySelector("#canvas");
const video = document.querySelector("#video");
const context = canvas.getContext("2d");
const secondImageSrc = "../../images/nice-cat.png";
let stream;

export const handleProfile = () => {
  if (!sessionId) {
    navigate("/");
    return;
  }

  displayUserInfos();

  logoutBtn.addEventListener("click", logout);

  addImageBtn.addEventListener("click", showSelfieBlock);
  closePhotoBtn.addEventListener("click", closePhoto);
  takePhotoBtn.addEventListener("click", takePhoto);
};

async function displayUserInfos() {
  const userInfosResp = await userService.getMe(sessionId);
  if (userInfosResp.ok) {
    const userInfosRespData = await userInfosResp.json();
    userStore.setState({ user: userInfosRespData });
  }

  const user = userStore.getState().user;

  usernameLabel.textContent = user.username;
  usernameLabel.addEventListener("click", (_event) => {
    const previous = profileDropdownMenu.style.display;
    profileDropdownMenu.style.display = previous === "block" ? "none" : "block";
  });

  const profileNameLabel = document.querySelector("#profile-name-label");
  profileNameLabel.textContent = `${user.firstName} ${user.lastName}`;

  const profileEmailLabel = document.querySelector("#profile-email-label");
  profileEmailLabel.textContent = user.email;

  const profileAdressLabel = document.querySelector("#profile-adress-label");
  profileAdressLabel.textContent = user.adress;
}

function logout(_event) {
  userService.logout(sessionId);
  sessionStorage.removeItem("sessionId");
}

async function showSelfieBlock(_event) {
  selfieBlock.classList.remove("hidden");

  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
  } catch (error) {
    console.error("Error accessing the camera:", error);
  }
}

async function takePhoto(event) {
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  context.globalAlpha = 0.5;
  //testing purpose
  const newImage = document.createElement("img");
  newImage.src = secondImageSrc;

  context.drawImage(newImage, 0, 0, canvas.width / 3, canvas.height / 3);
  context.globalAlpha = 1.0;

  const imageDataURL = canvas.toDataURL("image/jpeg");
  const link = document.createElement("a");
  link.href = imageDataURL;
  link.click();

  // sent to backend;

  video.classList.add("hidden");
  event.target.disabled = true;
  canvas.classList.remove("hidden");
}

function closePhoto(_event) {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
  }
  selfieBlock.classList.add("hidden");
}
