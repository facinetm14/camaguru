import { authApi } from "../api/auth.api.js";
import { SESSION_ID_KEY } from "./consts.js";
import { navigate } from "./events.js";
import { RouteUrl } from "./router.js";

export const handleLoginForm = () => {
  const userNameInput = document.querySelector("#username-from-login");
  const passwdInput = document.querySelector("#password-from-login");
  const loginBtn = document.querySelector("#login-btn");
  const callToSignUpBtn = document.querySelector("#call-to-signup");
  const CallToResetPasswordBtn = document.querySelector(
    "#call-to-reset-passwd"
  );
  const callToGaleryBtn = document.querySelector("#call-to-galery");

  loginBtn.addEventListener("click", handleLoginFormSubmit);
  callToSignUpBtn.addEventListener("click", handleCallToSignUp);
  CallToResetPasswordBtn.addEventListener("click", handleCallToResetPassword);
  callToGaleryBtn.addEventListener("click", (e) => {
    e.preventDefault();
    navigate(`/${RouteUrl.PROFILE}`);
  });

  async function handleLoginFormSubmit(event) {
    const username = userNameInput.value;
    const passwd = passwdInput.value;

    if (username && passwd) {
      const loginUserResp = await authApi.signIn(username, passwd);
      if (loginUserResp.ok) {
        const user = await loginUserResp.json();
        const { sessionId } = user;
        sessionStorage.setItem(SESSION_ID_KEY, sessionId);
        navigate(RouteUrl.PROFILE);
        return;
      }

      document.querySelector("#login-password-error").removeAttribute("hidden");
    }
  }

  async function handleCallToSignUp(_event) {
    navigate(RouteUrl.REGISTER);
  }

  async function handleCallToResetPassword(_event) {
    navigate(RouteUrl.RESET_PASSWORD);
  }
};
