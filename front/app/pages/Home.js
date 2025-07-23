import { Login } from "../components/Login.js";
import { SignUp } from "../components/SignUp.js";
import { PLAIN_API_BASE_ROUTE } from "../env.js";
import { handleLoginForm } from "../scripts/handleLoginForm.js";
import { handleSignUpForm } from "../scripts/handleSignUpForm.js";

export function Home() {
  const root = document.querySelector("#app");

  const [_, path] = window.location.pathname.split("/");
  const isRegister = path === "register";

  const childrenTemplate = isRegister ? SignUp() : Login();

  const template = `
  <div class="container" id="home-container">
  <div class="col-md-6 m-auto logo-wrapper">
    <img src="${PLAIN_API_BASE_ROUTE}/users/images/logo.png" alt="Camagru-logo" width="250" class="logo-img">
  </div>
  </div>

  ${childrenTemplate}

  <style>

    .logo-wrapper {
      text-align: center;
      padding: 0;
    }
  </style>
  `;
  root.innerHTML = template;

  if (isRegister) {
    return handleSignUpForm();
  }

  handleLoginForm();
}
