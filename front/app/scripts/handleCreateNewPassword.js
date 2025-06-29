import { navigate } from "./events.js";
import { RouteUrl } from "./router.js";
import { isPasswordStrong } from "./utils.js";
import { authApi } from "../api/auth.api.js";

export const handleCreateNewPassword = () => {
  const [_, _page, token] = window.location.pathname.split("/");

  (async () => {
    const resp = await authApi.verify(token);
    if (!resp.ok) {
      return navigate(`/${RouteUrl.NOT_FOUND}`);
    }

    const userId = await resp.json();

    const newPasswordInput = document.querySelector("#new-password-input");
    const newPasswordConfirmation = document.querySelector(
      "#new-password-input-confirmation"
    );
    const validatePasswordBtn = document.querySelector("#btn-new-password");
    validatePasswordBtn.addEventListener("click", updatePassword);

    async function updatePassword() {
      const password = newPasswordInput.value;
      const confirmation = newPasswordConfirmation.value;

      const errorPassword = document.querySelector("#password-error");
      if (!password) {
        errorPassword.removeAttribute("hidden");
        return;
      }
      if (!isPasswordStrong(password)) {
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

      const errorConfirm = document.querySelector("#confirm-error");
      if (!confirmation || !isMatchedPassword(confirmation)) {
        errorConfirm.removeAttribute("hidden");
        return;
      }
      errorConfirm.setAttribute("hidden", "true");

      await authApi.updatePassword(userId, password);

      navigate(`/${RouteUrl.HOME}`);
    }
  })();
};
