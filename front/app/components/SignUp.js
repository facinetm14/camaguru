export const SignUp = () => {
  return `
  <div class="signup-container">
    <form class="signup-form mt-3 mb-3">
      <div class="mb-3 col-md-11 m-auto">
        <label for="first-name" class="form-label">First Name</label>
        <input type="text" class="form-control" id="first-name">
        <span id="first-name-error" class="text-danger" hidden>Please enter your first name</span>
      </div>
      <div class="mb-3 col-md-11 m-auto">
        <label for="last-name" class="form-label">Last Name</label>
        <input type="text" class="form-control" id="last-name">
        <span id="last-name-error" class="text-danger" hidden>Please enter your last name</span>
      </div>
      <div class="mb-3 col-md-11 m-auto">
        <label for="username" class="form-label">Username</label>
        <input type="text" class="form-control" id="username">
        <span id="username-error" class="text-danger" hidden>Please enter your username</span>
      </div>
      <div class="mb-3 col-md-11 m-auto">
        <label for="adress" class="form-label">Adress</label>
        <input type="text" class="form-control" id="adress" >
        <span id="adress-error" class="text-danger" hidden>Please enter your adress</span>
      </div>
      <div class="mb-3 col-md-11 m-auto">
        <label for="email" class="form-label">Email</label>
        <input type="email" class="form-control" id="email" >
        <span id="email-error" class="text-danger" hidden>Please enter your email</span>
      </div>
      <div class="mb-3 col-md-11 m-auto" id="password-block">
        <label for="password" class="form-label">Password</label>
        <input type="password" class="form-control" id="password">
        <span id="password-error" class="text-danger" hidden>Please enter your password</span>
      </div>
      <div class="mb-3 col-md-11 m-auto">
        <label for="password-confirmation" class="form-label">Password confirmation</label>
        <input type="password" class="form-control" id="password-confirmation" >
        <span id="confirm-error" class="text-danger" hidden>Passwords do not match</span>
      </div>
      <div class="mb-3 col-md-11 m-auto">
        <input type="checkbox" class="" id="agreementCheckbox">
        <label for="agreementCheckbox">I'm happy to share my data with camagru App</label>
        <span id="agreement-error" class="text-danger" hidden>Please check the agreement.</span>

      </div>
      <div class="col-md-11 m-auto">
        <button type="button" class="btn btn-success" id="btn-signup">Register</button>
        <span id="register-error" class="text-danger" hidden>Failed to register user.</span>
      </div>
    </form>
  </div>
  

  <style>
    .signup-container {
      margin: auto;
      width: 380px;
      border: 1px solid gray;
      border-radius: 5px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);  
      padding: 0;
    }
  </style>
  `;
};
