import userStore from "../../scripts/userStore.js";
import { navigate } from "./events.js";
import {
  buildUpdateUserInfosRequest,
  CommentNotificationStatus,
  GaleryOwner,
  GaleryPagination,
  isImportingValidImage,
  isPasswordStrong,
  isValidEmail,
  uuid,
} from "./utils.js";
import { ENTER_KEY, SESSION_ID_KEY } from "./consts.js";
import { PLAIN_API_BASE_ROUTE } from "../env.js";
import { RouteUrl } from "./router.js";
import { GALERY_ITEM_LIMIT_PER_PAGE } from "./utils.js";
import { authApi } from "../api/auth.api.js";
import { userApi } from "../api/user.api.js";

let stream = null;
let isActiveImageItemView = false;

export const handleProfile = () => {
  // layout binding
  const sessionId = sessionStorage.getItem(SESSION_ID_KEY);
  const baseImageUrl = `${PLAIN_API_BASE_ROUTE}/users/images`;
  const logoutBtn = document.querySelector("#logout");
  const profileDropdownMenu = document.querySelector("#profile-dropdownMenu");
  const usernameLabel = document.querySelector("#username-label");
  const addImageBtn = document.querySelector("#btn-add-image");
  const selfieBlock = document.querySelector("#block-selfie");
  const takePhotoBtn = document.querySelector("#take-photo");
  const closePhotoBtn = document.querySelector("#close-photo");
  const importPhotoBtn = document.querySelector("#import-photo");
  const canvas = document.querySelector("#canvas");
  const video = document.querySelector("#video");
  const savePhotoBtn = document.querySelector("#save-photo");
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
  const commentNotificationOption = document.querySelector(
    "#comment-notification"
  );

  const previousFromMyGalery = document.querySelector(
    `#prev-${GaleryOwner.ME}`
  );
  const nextFromMyGalery = document.querySelector(`#next-${GaleryOwner.ME}`);

  const previousFromOtherGalery = document.querySelector(
    `#prev-${GaleryOwner.OTHER}`
  );
  const nextFromOtherGalery = document.querySelector(
    `#next-${GaleryOwner.OTHER}`
  );

  const wallPaperItemList = document.querySelectorAll(".wall-paper-item");
  const editSaveBtn = document.querySelector("#edit-save");
  const context = canvas ? canvas.getContext("2d") : null;
  const selectedWallPaper = document.querySelector(".active-wall-paper");

  let filename;
  let fileInbase64;
  let secondImageSrc = `${baseImageUrl}/${selectedWallPaper.dataset.imagesrc}`;

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
    if (user.commentNotification === CommentNotificationStatus.ACTIVE) {
      commentNotificationOption.setAttribute("checked", "true");
    }
  };

  const logout = (_event) => {
    authApi.logout(sessionId);
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

  const clearCanvas = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  const mergeImage = (primarySrc, secondarySrc) => {
    context.drawImage(primarySrc, 0, 0, canvas.width, canvas.height);
    context.globalAlpha = 0.5;
    const newImage = document.createElement("img");
    newImage.crossOrigin = "anonymous";
    newImage.src = secondarySrc;

    newImage.onload = () => {
      context.drawImage(newImage, 0, 0, canvas.width / 3, canvas.height / 3);
      context.globalAlpha = 1.0;

      const imageDataURL = canvas.toDataURL("image/jpeg");
      const user = userStore.getState().user;

      fileInbase64 = imageDataURL.split(",")[1];
      filename = `img-${user.username}-${uuid()}.jpg`;
      savePhotoBtn.classList.remove("btn-disabled");
      savePhotoBtn.classList.add("btn-active");
      savePhotoBtn.removeAttribute("disabled");
      canvas.classList.remove("hidden");
    };
  };

  const takePhoto = (_event) => {
    takePhotoBtn.classList.add("pressed");
    takePhotoBtn.classList.remove("btn-active");

    mergeImage(video, secondImageSrc);
    video.classList.add("hidden");

    takePhotoBtn.setAttribute("disabled", "true");
  };

  const closePhoto = (_event) => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    selfieBlock.classList.add("hidden");
    canvas.classList.add("hidden");
    takePhotoBtn.removeAttribute("disabled");
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

  const cleanUp = () => {
    clearCanvas();
    video.classList.remove("hidden");
    canvas.classList.add("hidden");
    savePhotoBtn.classList.add("btn-disabled");
    savePhotoBtn.classList.remove("btn-active");
    savePhotoBtn.setAttribute("disabled", "true");
    takePhotoBtn.removeAttribute("disabled");
    takePhotoBtn.classList.add("btn-active");
    filename = "";
    fileInbase64 = "";
  };

  const handlePagination = () => {
    const { myImageList, otherImageList, myGaleryStart, otherGaleryStart } =
      userStore.getState();
    if (myImageList.length > myGaleryStart + GALERY_ITEM_LIMIT_PER_PAGE) {
      nextFromMyGalery.removeAttribute("hidden");
    }
    if (myGaleryStart > 0) {
      previousFromMyGalery.removeAttribute("hidden");
    }

    if (otherImageList.length > otherGaleryStart + GALERY_ITEM_LIMIT_PER_PAGE) {
      nextFromOtherGalery.removeAttribute("hidden");
    }

    if (otherGaleryStart > 0) {
      previousFromOtherGalery.removeAttribute("hidden");
    }
  };

  const handleGalery = () => {
    for (const imageItem of imageItemList) {
      const id = imageItem.dataset.imageid;
      const key = imageItem.dataset.imagekey;
      const imageItemView = document.querySelector(`#${key}`);
      const closeView = document.querySelector(`#close-view-${key}`);
      const viewFullBtn = document.querySelector(`#view-full-btn-${key}`);
      const commentsBtn = document.querySelector(`#comments-btn-${key}`);
      const likesBtn = document.querySelector(`#likes-btn-${key}`);
      const inputComment = document.querySelector(`#input-comment-${key}`);
      const deleteImageBtn = document.querySelector(`#delete-image-btn-${key}`);
      const shareImageBtn = document.querySelector(`#share-image-btn-${key}`);
      const img = document.querySelector(`#img-${key}`);

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

      likesBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        await userApi.likeOrDisLikeImage(id);
        navigate(`/${RouteUrl.PROFILE}`);
      });

      inputComment.addEventListener("keydown", async (e) => {
        const key = e.keyCode;
        if (key !== ENTER_KEY) {
          return;
        }

        const comment = `${e.target.value}`.trim();
        await userApi.commentImage(id, comment);
        e.target.value = "";
        toggleBlock(inputComment);
        navigate(`/${RouteUrl.PROFILE}`);
      });

      deleteImageBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        await userApi.deleteUserImage(id);
        navigate(`/${RouteUrl.PROFILE}`);
      });

      shareImageBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        const src = img.src;
        await userApi.shareImage(src);
      });
    }
  };

  const savePhoto = async (e) => {
    e.preventDefault();
    takePhotoBtn.classList.remove("pressed");

    if (filename && fileInbase64) {
      await userApi.uploadImage(filename, fileInbase64);
    }

    cleanUp();
  };

  const importPhoto = (e) => {
    video.classList.add("hidden");
    canvas.classList.remove("hidden");
    const file = e.target.files[0];

    if (isImportingValidImage(file)) {
      const reader = new FileReader();

      reader.onload = function (subEvent) {
        const imageDataUrl = subEvent.target.result;
        const primarySrc = new Image();
        primarySrc.crossOrigin = "anonymous";
        primarySrc.src = imageDataUrl;
        primarySrc.onload = function (e) {
          mergeImage(primarySrc, secondImageSrc);
        };
      };
      reader.readAsDataURL(file);
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

    const errorFirstName = document.querySelector("#edit-first-name-error");
    if (!firstName) {
      errorFirstName.removeAttribute("hidden");
      return;
    }
    errorFirstName.setAttribute("hidden", "true");

    const errorLastName = document.querySelector("#edit-last-name-error");
    if (!lastName) {
      errorLastName.removeAttribute("hidden");
      return;
    }
    errorLastName.setAttribute("hidden", "true");

    const errorUsername = document.querySelector("#edit-username-error");
    if (!username) {
      errorUsername.removeAttribute("hidden");
      return;
    }

    if (username.toLowerCase() !== user.username.toLowerCase()) {
      const doesUserNameExists = await userApi.doesUserNameExists(username);
      if (doesUserNameExists) {
        errorUsername.textContent = "username already exists";
        errorUsername.removeAttribute("hidden");
        return;
      }
    }
    errorUsername.setAttribute("hidden", "true");

    const errorAdress = document.querySelector("#edit-adress-error");
    if (!adress) {
      errorAdress.removeAttribute("hidden");
      return;
    }
    errorAdress.setAttribute("hidden", "true");

    const errorEmail = document.querySelector("#edit-email-error");
    if (!email) {
      errorEmail.removeAttribute("hidden");
      return;
    }

    if (!isValidEmail(email)) {
      errorEmail.textContent = "Please enter a valid email";
      errorEmail.removeAttribute("hidden");
      return;
    }

    if (email.toLowerCase() !== user.email.toLowerCase()) {
      const doesEmailExists = await userApi.doesEmailExists(email);
      if (doesEmailExists) {
        errorEmail.textContent = "email already exists";
        errorEmail.removeAttribute("hidden");
        return;
      }
    }
    errorEmail.setAttribute("hidden", "true");

    if (newPasswd || confirm) {
      const errorPassword = document.querySelector("#edit-password-error");
      if (!isPasswordStrong(newPasswd)) {
        errorPassword.innerHTML = `<span>
      Your password is two weak, it must contain</br>
      <ul>
        <li>At least 12 caracters</li>
        <li>At least a lowercase</li>
        <li>At least an Uppercase</li>
        <li>At least a special carracter</li>
        <li>At least a digit</li>
      </ul>
      </span>`;
        errorPassword.removeAttribute("hidden");
        return;
      }
      errorPassword.setAttribute("hidden", "true");

      const errorConfirm = document.querySelector("#edit-confirm-error");
      if (newPasswd !== confirm) {
        errorConfirm.removeAttribute("hidden");
        return;
      }
      errorConfirm.setAttribute("hidden", "true");

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
        commentNotification: commentNotificationOption.checked
          ? CommentNotificationStatus.ACTIVE
          : CommentNotificationStatus.DISABLED,
      },
      user
    );
    const errorSave = document.querySelector("#edit-save-error");
    if (!updateUserInfosRequest) {
      errorSave.textContent = "No field change";
      errorSave.removeAttribute("hidden");
      return;
    }
    errorSave.setAttribute("hidden", "true");

    const updateUserInfosResult = await userApi.updateUserInfos(
      updateUserInfosRequest
    );

    if (updateUserInfosResult.ok) {
      navigate(`/${RouteUrl.PROFILE}`);
      return;
    } else {
      errorSave.removeAttribute("hidden");
    }
  };

  const handleViewProfile = (e) => {
    e.preventDefault();
    toggleBlock(viewInfosBlock);
  };

  const handleWallPaperSelection = () => {
    for (const wallpaperItem of wallPaperItemList) {
      wallpaperItem.addEventListener("click", (e) => {
        const src = `${baseImageUrl}/${wallpaperItem.dataset.imagesrc}`;
        secondImageSrc = src;

        const current = document.querySelector(".active-wall-paper");
        current.classList.remove("active-wall-paper");
        wallpaperItem.classList.add("active-wall-paper");
      });
    }
  };

  displayUserInfos();
  handleGalery();
  handlePagination();
  handleWallPaperSelection();

  const movePage = (start, origin) => {
    localStorage.setItem(origin, start);
    navigate(`${RouteUrl.HOME}`);
  };

  logoutBtn.addEventListener("click", logout);
  addImageBtn.addEventListener("click", showSelfieBlock);
  closePhotoBtn.addEventListener("click", closePhoto);
  takePhotoBtn.addEventListener("click", takePhoto);
  savePhotoBtn.addEventListener("click", savePhoto);
  editUserInfosBtn.addEventListener("click", handleViewProfile);
  editSaveBtn.addEventListener("click", updateUserInfos);
  importPhotoBtn.addEventListener("change", importPhoto);

  nextFromMyGalery.addEventListener("click", (e) => {
    const { myGaleryStart } = userStore.getState();

    const start = myGaleryStart + GALERY_ITEM_LIMIT_PER_PAGE;
    localStorage.setItem(GaleryPagination.MY_GALERY_START, start);
    navigate(`${RouteUrl.HOME}`);
  });

  previousFromMyGalery.addEventListener("click", (e) => {
    const { myGaleryStart } = userStore.getState();
    const start = myGaleryStart - GALERY_ITEM_LIMIT_PER_PAGE;
    movePage(start, GaleryPagination.MY_GALERY_START);
  });

  nextFromOtherGalery.addEventListener("click", (e) => {
    const { otherGaleryStart } = userStore.getState();
    const start = otherGaleryStart + GALERY_ITEM_LIMIT_PER_PAGE;
    movePage(start, GaleryPagination.OTHER_GALERY_START);
  });

  previousFromOtherGalery.addEventListener("click", (e) => {
    const { otherGaleryStart } = userStore.getState();
    const start = otherGaleryStart - GALERY_ITEM_LIMIT_PER_PAGE;
    movePage(start, GaleryPagination.OTHER_GALERY_START);
  });
};
