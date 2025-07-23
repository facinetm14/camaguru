import { PLAIN_API_BASE_ROUTE } from "../env.js";
import { handleCreateNewPassword } from "../scripts/handleCreateNewPassword.js";

export const CreateNewPassword = () => {
  const root = document.querySelector("#app");
  const template = `
  <div class="m-auto logo-wrapper" style="display: flex; justify-content: center;">
    <img src="${PLAIN_API_BASE_ROUTE}/users/images/logo.png" alt="Camagru-logo" width="250" class="logo-img">
  </div>
  
  <div class="new-password-container mt-3" id="new-password-container">
    <form class="signup-form mt-3 mb-3">
      <div class="mb-3 col-md-11 m-auto">
        <label for="password" class="form-label">New password</label>
        <input type="password" class="form-control" id="new-password-input">
        <span id="password-error" class="text-danger" hidden>Please enter your new password</span>
      </div>
      <div class="mb-3 col-md-11 m-auto">
        <label for="password-confirmation" class="form-label">Password confirmation</label>
        <input type="password" class="form-control" id="new-password-input-confirmation">
        <span id="confirm-error" class="text-danger" hidden>Please confirm your new password</span>
      </div>
      <div class="col-md-11 m-auto">
        <button type="button" class="btn btn-success" id="btn-new-password">Valider</button>
      </div>
    </form>
  </div>

  <style>
    .new-password-container {
      margin: auto;
      width: 380px;
      border: 1px solid gray;
      border-radius: 5px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      padding: 0;
    }

    @media only screen and (max-width: 600px) {
      .new-password-container  {
        width: 350px;
        padding: 10px;
      }
    }
  </style>
  `;

  root.innerHTML = template;

  handleCreateNewPassword();
};
