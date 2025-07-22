import { Activate } from "../pages/Activate.js";
import { Confirm } from "../pages/Confirm.js";
import { Home } from "../pages/Home.js";
import { NotFound } from "../pages/NotFound.js";
import { Profile } from "../pages/Profile.js";
import { ResetPassword } from "../pages/ResetPassword.js";
import { ConfrimPasswordReset } from "../pages/ConfirmPasswordReset.js";
import { CreateNewPassword } from "../pages/CreateNewPassword.js";
import { navigate } from "./events.js";
import userStore from "./userStore.js";
import { setGlobalState } from "./userStore.js";

export const RouteUrl = {
  HOME: "",
  REGISTER: "register",
  CONFIRM: "confirm",
  CONFIRM_PASSWORD_RESET: "confirm-password-reset",
  NOT_FOUND: "404",
  PROFILE: "galery",
  RESET_PASSWORD: "reset-password",
  ACTIVATE_USER: "activate",
  CREATE_NEW_PASSWORD: "create-new-password",
};

export const routes = new Map([
  [RouteUrl.HOME, Home],
  [RouteUrl.REGISTER, Home],
  [RouteUrl.CONFIRM, Confirm],
  [RouteUrl.CONFIRM_PASSWORD_RESET, ConfrimPasswordReset],
  [RouteUrl.ACTIVATE_USER, Activate],
  [RouteUrl.NOT_FOUND, NotFound],
  [RouteUrl.PROFILE, Profile],
  [RouteUrl.RESET_PASSWORD, ResetPassword],
  [RouteUrl.CREATE_NEW_PASSWORD, CreateNewPassword],
]);

export async function redirectToHomeOrDisplayPage(sessionId, path, page) {
  await setGlobalState(sessionId);
  const user = userStore.getState().user;

  page();
}
