import { userService } from "../../usecases/userService.js";
import userStore from "../../scripts/userStore.js";
import { navigate } from "./events.js";
import { uuid } from "./utils.js";

export const handleProfile = () => {
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
  const context = canvas ? canvas.getContext("2d") : null;
  const secondImageSrc = "/images/nice-cat.png";
  let stream;

  if (!sessionId) {
    navigate("/");
    return;
  }

  const displayUserInfos = async () => {
    const userInfosResp = await userService.getMe(sessionId);
    if (userInfosResp.ok) {
      const userInfosRespData = await userInfosResp.json();
      userStore.setState({ user: userInfosRespData });
    }

    const user = userStore.getState().user;

    usernameLabel.textContent = user.username;
    usernameLabel.addEventListener("click", (_event) => {
      const previous = profileDropdownMenu.style.display;
      profileDropdownMenu.style.display =
        previous === "block" ? "none" : "block";
    });

    const profileNameLabel = document.querySelector("#profile-name-label");
    profileNameLabel.textContent = `${user.firstName} ${user.lastName}`;

    const profileEmailLabel = document.querySelector("#profile-email-label");
    profileEmailLabel.textContent = user.email;

    const profileAdressLabel = document.querySelector("#profile-adress-label");
    profileAdressLabel.textContent = user.adress;
  };

  const logout = (_event) => {
    userService.logout(sessionId);
    sessionStorage.removeItem("sessionId");
  };

  const showSelfieBlock = async (_event) => {
    selfieBlock.classList.remove("hidden");

    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = stream;
    } catch (error) {
      console.error("Error accessing the camera:", error);
    }
  };

  const takePhoto = (event) => {
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    context.globalAlpha = 0.5;

    //testing purpose
    const newImage = document.createElement("img");
    newImage.src = secondImageSrc;

    context.drawImage(newImage, 0, 0, canvas.width / 3, canvas.height / 3);
    context.globalAlpha = 1.0;

    const imageDataURL = canvas.toDataURL("image/jpeg");
    const user = userStore.getState().user;

    const base64Data = imageDataURL.split(",")[1];
    const filename = `img-${user.username}-${uuid()}.jpg`;

    userService.uploadImage(filename, base64Data);

    video.classList.add("hidden");
    event.target.disabled = true;
    canvas.classList.remove("hidden");
  };

  const closePhoto = (_event) => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    selfieBlock.classList.add("hidden");
  };

  displayUserInfos();

  logoutBtn.addEventListener("click", logout);
  addImageBtn.addEventListener("click", showSelfieBlock);
  closePhotoBtn.addEventListener("click", closePhoto);
  takePhotoBtn.addEventListener("click", takePhoto);
};
