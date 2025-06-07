import { userService } from "../usecases/userService.js";
import { navigate } from "./events.js";
import { RouteUrl } from "./router.js";
import { isValidEmail } from "./utils.js";

export const handleResetPasswordForm = () => {
  const emailToResetPasswdInput = document.querySelector("#email-from-reset");
  const submitResetPasswdBtn = document.querySelector(
    "#reset-password-submit-form"
  );

  submitResetPasswdBtn.addEventListener("click", sendResetPasswordRequest);

  async function sendResetPasswordRequest(_event) {
    const email = emailToResetPasswdInput.value;
    if (!email || !isValidEmail(email)) {
      return;
    }

    const resut = await userService.sendResetPasswordRequest(email);
    if (resut.ok) {
      navigate(RouteUrl.CONFIRM_PASSWORD_RESET);
    }
  }
};
