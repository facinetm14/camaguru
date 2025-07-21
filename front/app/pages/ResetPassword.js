import { PLAIN_API_BASE_ROUTE } from "../env.js";
import { handleResetPasswordForm } from "../scripts/handleResetPassword.js";

export const ResetPassword = () => {
  const root = document.querySelector("#app");

  const template = `
  <div class="m-auto logo-wrapper" style="display: flex; justify-content: center;">
    <img src="${PLAIN_API_BASE_ROUTE}/users/images/logo.png" alt="Camagru-logo" width="250" class="logo-img">
  </div>

  <div class="container reset-password-container" id="reset-password-container">
    <form class="login-form mt-3 mb-3">
      <div class="mb-3 col-md-11 m-auto">
          <label for="email" class="form-label">Email</label>
          <input type="email" class="form-control" id="email-from-reset" aria-describedby="">
          <span id="email-from-reset-error" class=""></span>
      </div>
      <div class="col-md-11 m-auto">
          <button type="button" class="btn btn-success" id="reset-password-submit-form">Envoyer</button>
      </div>
    </form>
  </div>


  <style>
    .reset-password-container {
      margin: auto;
      margin-top: 20px;
      width: 380px;
      border: 1px solid gray;
      border-radius: 5px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      padding: 0;
    }
  </style>
  `;

  root.innerHTML = template;

  handleResetPasswordForm();
};
