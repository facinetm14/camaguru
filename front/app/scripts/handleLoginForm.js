import { userService } from "../usecases/userService.js";
import { navigate, NAVIGATE_TO_PAGE } from "./events.js";

export const handleLoginForm = () => {
  const userNameInput = document.querySelector("#username-from-login");
  const passwdInput = document.querySelector("#password-from-login");
  const loginBtn = document.querySelector("#login-btn");
  const callToSignUpBtn = document.querySelector("#call-to-signup");

  loginBtn.addEventListener("click", handleLoginFormSubmit);
  callToSignUpBtn.addEventListener("click", handleCallToSignUp);

  async function handleLoginFormSubmit(event) {
    const username = userNameInput.value;
    const passwd = passwdInput.value;

    if (username && passwd) {
      const loginUserResp = await userService.signIn(username, passwd);
      if (loginUserResp.ok) {
        const user = await loginUserResp.json();
        const { sessionId } = user;
        sessionStorage.setItem("sessionId", sessionId);
        navigate("/profile");
      }
    }
  }

  async function handleCallToSignUp(_event) {
    navigate("/register");
  }
};
