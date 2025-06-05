import { userService } from "../../usecases/userService.js";

const emailToResetPasswdInput = document.querySelector("#email-from-reset");
const submitResetPasswdBtn = document.querySelector(
  "#reset-password-submit-form"
);

submitResetPasswdBtn.addEventListener("click", sendResetPasswordRequest);

async function sendResetPasswordRequest(_event) {
  const email = emailToResetPasswdInput.value;
  if (!email) {
    return;
  }
  await userService.sendResetPasswordRequest(email);
}
