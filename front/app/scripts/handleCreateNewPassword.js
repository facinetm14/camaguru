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

      if (!password || !isPasswordStrong(password)) {
        return;
      }

      if (password !== confirmation) {
        return;
      }

      await authApi.updatePassword(userId, password);

      navigate(`/${RouteUrl.HOME}`);
    }
  })();
};
