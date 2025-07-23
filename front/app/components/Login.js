export const Login = () => {
  return `
    <div class="login-container">
      <form class="login-form mt-3 mb-3">
      <div class="mb-3 col-md-11 m-auto">
        <label for="username" class="form-label">Username</label>
        <input type="text" class="form-control" id="username-from-login" aria-describedby="">
        <span id="username-error" class="text-danger" hidden></span>
      </div>
      <div class="mb-3 col-md-11 m-auto">
        <label for="password" class="form-label">Password</label>
        <input type="password" class="form-control" id="password-from-login">
        <span id="login-password-error" class="text-danger" hidden>Invalid credentials</span>
      </div>
      <div class="col-md-11 m-auto">
        <button type="button" class="btn btn-success" id="login-btn">Login</button>
        <span class="call-to-action">
          Don't have an account ? <span id="call-to-signup">Register</span><br/>
          Forgot Password ? <span id="call-to-reset-passwd">Reset</span><br/>
        </span>
      </div>
      </form>
      <div id="call-to-galery" class="goto-galery">See other users's creation</div>
    </div>


    <style>
    .call-to-action {
     float: right;

      span {
        color: white;
        cursor: pointer;

        &:hover {
          text-decoration: underline;
        }
        
      }
    }

    .login-container {
      margin: auto;
      width: 380px;
      border: 1px solid gray;
      border-radius: 5px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      padding: 0;
    }

    @media only screen and (max-width: 600px) {
      .login-container  {
        width: 350px;
        padding: 10px;
      }
    }


    .goto-galery {
      color: white;
      cursor: pointer;
      text-align: center;
      margin-top: 30px;
      margin-bottom: 10px;

      &:hover {
        text-decoration: underline;
      }
    }
    </style>
  `;
};
