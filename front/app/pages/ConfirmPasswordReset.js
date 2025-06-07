export const ConfrimPasswordReset = () => {
  const root = document.querySelector("#app");

  const template = `
  <div class="container card mt-5 bg-success" id="reset-password-link">
    <div class="card-body">
        You've requested to change your password. A link has been sent to your email to create a new one.
    </div>
  </div>

  <style>
      .container {
          width: fit-content;
          color: white;
      }
  </style>
  `;

  root.innerHTML = template;
};
