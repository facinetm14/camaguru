import { userService } from "../../usecases/userService.js";
import userStore from "../../scripts/userStore.js";
import { navigate } from "./events.js";
import {
  buildUpdateUserInfosRequest,
  isPasswordStrong,
  uuid,
} from "./utils.js";
import { SESSION_ID_KEY } from "./consts.js";
import { PLAIN_API_BASE_ROUTE } from "../env.js";
import { RouteUrl } from "./router.js";
let stream = null;
let isActiveImageItemView = false;

export const handleProfile = () => {
  const sessionId = sessionStorage.getItem(SESSION_ID_KEY);

  const logoutBtn = document.querySelector("#logout");
  const profileDropdownMenu = document.querySelector("#profile-dropdownMenu");
  const usernameLabel = document.querySelector("#username-label");
  const addImageBtn = document.querySelector("#btn-add-image");
  const selfieBlock = document.querySelector("#block-selfie");
  const takePhotoBtn = document.querySelector("#take-photo");
  const closePhotoBtn = document.querySelector("#close-photo");
  const canvas = document.querySelector("#canvas");
  const video = document.querySelector("#video");
  const imageItemList = document.querySelectorAll(".image-item");
  const editUserInfosBtn = document.querySelector("#edit-infos-btn");
  const viewInfosBlock = document.querySelector("#view-infos-block");

  const editFirstNameField = document.querySelector("#edit-first-name");
  const editLastNameField = document.querySelector("#edit-last-name");
  const editUserNameFIeld = document.querySelector("#edit-username");
  const editAdressField = document.querySelector("#edit-adress");
  const editEmail = document.querySelector("#edit-email");
  const editPasswordField = document.querySelector("#edit-password");
  const editPasswordConfirmField = document.querySelector(
    "#edit-password-confirm"
  );
  const editSaveBtn = document.querySelector("#edit-save");

  const context = canvas ? canvas.getContext("2d") : null;
  const secondImageSrc = `${PLAIN_API_BASE_ROUTE}/users/images/logo.png`;

  const displayUserInfos = async () => {
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

    editFirstNameField.value = user.firstName;
    editLastNameField.value = user.lastName;
    editUserNameFIeld.value = user.username;
    editAdressField.value = user.adress;
    editEmail.value = user.email;
    editAdressField.value = user.adress;
  };

  const logout = (_event) => {
    userService.logout(sessionId);
    sessionStorage.removeItem(SESSION_ID_KEY);
  };

  const showSelfieBlock = async (_event) => {
    selfieBlock.classList.remove("hidden");
    video.classList.remove("hidden");

    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = stream;
    } catch (error) {
      console.error("Error accessing the camera:", error);
    }
  };

  const takePhoto = (_event) => {
    takePhotoBtn.classList.add("pressed");
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
    takePhotoBtn.disabled = true;
    canvas.classList.remove("hidden");
  };

  const closePhoto = (_event) => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    selfieBlock.classList.add("hidden");
    canvas.classList.add("hidden");
    takePhotoBtn.disabled = false;
    takePhotoBtn.classList.remove("pressed");
    navigate(RouteUrl.PROFILE);
  };

  const toggleBlock = (block) => {
    if (block.classList.contains("hidden")) {
      block.classList.remove("hidden");
    } else {
      block.classList.add("hidden");
    }
  };

  const handleGalery = (_prefix) => {
    for (const imageItem of imageItemList) {
      const id = imageItem.dataset.imageid;
      const imageItemView = document.querySelector(`#${id}`);
      const closeView = document.querySelector(`#close-view-${id}`);
      const viewFullBtn = document.querySelector(`#view-full-btn-${id}`);
      const commentsBtn = document.querySelector(`#comments-btn-${id}`);
      const inputComment = document.querySelector(`#input-comment-${id}`);

      viewFullBtn.addEventListener("click", (event) => {
        event.preventDefault();

        if (isActiveImageItemView) {
          return;
        }

        imageItemView.classList.remove("hidden");
        isActiveImageItemView = true;
      });

      commentsBtn.addEventListener("click", (event) => {
        event.preventDefault();
        toggleBlock(inputComment);
      });

      closeView.addEventListener("click", (event) => {
        event.preventDefault();
        imageItemView.classList.add("hidden");
        isActiveImageItemView = false;
      });
    }
  };

  const updateUserInfos = async (e) => {
    e.preventDefault();

    const firstName = editFirstNameField.value;
    const lastName = editLastNameField.value;
    const username = editUserNameFIeld.value;
    const adress = editAdressField.value;
    const email = editEmail.value;
    const newPasswd = editPasswordField.value;
    const confirm = editPasswordConfirmField.value;
    const user = userStore.getState().user;
    let passwd = "";

    if (newPasswd || confirm) {
      if (newPasswd !== confirm || !isPasswordStrong(newPasswd)) {
        //!!TODO hanlde error
        return;
      }
      passwd = newPasswd;
    }

    const updateUserInfosRequest = buildUpdateUserInfosRequest(
      {
        firstName,
        lastName,
        username,
        adress,
        email,
        ...(passwd && { passwd }),
      },
      user
    );

    if (!updateUserInfosRequest) {
      //!!TODO handle error nothing to update
      return;
    }

    const updateUserInfosResult = await userService.updateUserInfos(
      updateUserInfosRequest
    );

    if (updateUserInfosResult.ok) {
      navigate(`/${RouteUrl.PROFILE}`);
    } else {
      //!!TODO handle error update infos
    }
  };

  const handleViewProfile = (e) => {
    e.preventDefault();
    toggleBlock(viewInfosBlock);
  };

  displayUserInfos();
  handleGalery();

  logoutBtn.addEventListener("click", logout);
  addImageBtn.addEventListener("click", showSelfieBlock);
  closePhotoBtn.addEventListener("click", closePhoto);
  takePhotoBtn.addEventListener("click", takePhoto);
  editUserInfosBtn.addEventListener("click", handleViewProfile);
  editSaveBtn.addEventListener("click", updateUserInfos);
};
