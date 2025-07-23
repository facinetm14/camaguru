export const Confirm = () => {
  const root = document.querySelector("#app");

  const template = `
  <div class="container card mt-5 bg-success" id="confirm-container">
    <div class="card-body">
        You have successfully register. A confirmation link has been sent to your email, please click on it.
    </div>
  </div>

  <style>
    .container {
      width: fit-content;
      color: white;
    }

    @media only screen and (max-width: 600px) {
      .container  {
        width: 350px;
      }
    }
  </style>
  `;

  root.innerHTML = template;
};
