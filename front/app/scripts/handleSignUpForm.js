import { isValidEmail, isPasswordStrong } from "../../scripts/utils.js";
import { authApi } from "../api/auth.api.js";
import { userApi } from "../api/user.api.js";
import { navigate } from "./events.js";
import { RouteUrl } from "./router.js";

export const handleSignUpForm = () => {
  const firstNameInput = document.querySelector("#first-name");
  const lastNameInput = document.querySelector("#last-name");
  const usernameInput = document.querySelector("#username");
  const adressInput = document.querySelector("#adress");
  const emailInput = document.querySelector("#email");
  const agreementCheckbox = document.querySelector("#agreementCheckbox");
  const passwdConfirmationInput = document.querySelector(
    "#password-confirmation"
  );
  const passwdInput = document.querySelector("#password");
  const signupBtn = document.querySelector("#btn-signup");

  function handleInput(event, validator) {
    const inputValue = event.target.value;
    if (validator(inputValue)) {
      event.target.style.borderColor = "green";
      return;
    }
    event.target.style.borderColor = "red";
  }

  function isMatchedPassword(passwdConfirmation) {
    return passwdInput.value === passwdConfirmation;
  }

  async function handleSignUpFormSubmit(_event) {
    const username = usernameInput.value;
    const adress = adressInput.value;
    const email = emailInput.value;
    const agreement = agreementCheckbox.checked;
    const passwdConfirmation = passwdConfirmationInput.value;
    const passwd = passwdInput.value;
    const firstName = firstNameInput.value;
    const lastName = lastNameInput.value;

    const errorFirstName = document.querySelector("#first-name-error");
    if (!firstName) {
      errorFirstName.removeAttribute("hidden");
      return;
    }
    errorFirstName.setAttribute("hidden", "true");

    const errorLastName = document.querySelector("#last-name-error");
    if (!lastName) {
      errorLastName.removeAttribute("hidden");
      return;
    }
    errorLastName.setAttribute("hidden", "true");

    const errorUsername = document.querySelector("#username-error");
    if (!username) {
      errorUsername.removeAttribute("hidden");
      return;
    }
    const doesUserNameExists = await userApi.doesUserNameExists(username);
    if (doesUserNameExists) {
      errorUsername.textContent = "this username is already used";
      errorUsername.removeAttribute("hidden");
      return;
    }
    errorUsername.setAttribute("hidden", "true");

    const errorAdress = document.querySelector("#adress-error");
    if (!adress) {
      errorAdress.removeAttribute("hidden");
      return;
    }
    errorAdress.setAttribute("hidden", "true");

    const emailError = document.querySelector("#email-error");
    if (!email) {
      emailError.removeAttribute("hidden");
      return;
    }
    if (!isValidEmail(email)) {
      emailError.textContent = "Invalid email";
      emailError.removeAttribute("hidden");
      return;
    }
    const doesEmailExists = await userApi.doesEmailExists(email);
    if (doesEmailExists) {
      emailError.textContent = "This email is already used";
      emailError.removeAttribute("hidden");
      return;
    }
    emailError.setAttribute("hidden", "true");

    const errorPassword = document.querySelector("#password-error");
    if (!passwd) {
      errorPassword.removeAttribute("hidden");
      return;
    }
    if (!isPasswordStrong(passwd)) {
      errorPassword.innerHTML = `<span>
      Your password is two weak, it must contain</br>
      <ul>
        <li>At least 12 caracters</li>
        <li>At least a lowercase</li>
        <li>At least an Uppercase</li>
        <li>At least a special carracter</li>
        <li>At least a digit</li>
      </ul>
      </span>`;
      errorPassword.removeAttribute("hidden");
      return;
    }
    errorPassword.setAttribute("hidden", "true");

    const errorConfirm = document.querySelector("#confirm-error");
    if (!passwdConfirmation || !isMatchedPassword(passwdConfirmation)) {
      errorConfirm.removeAttribute("hidden");
      return;
    }
    errorConfirm.setAttribute("hidden", "true");

    const errorAgrement = document.querySelector("#agreement-error");
    if (!agreement) {
      errorAgrement.removeAttribute("hidden");
      return;
    }
    errorAgrement.setAttribute("hidden", "true");

    const user = {
      email,
      adress,
      passwd,
      username,
      firstName,
      lastName,
    };

    const registerUser = await authApi.register(user);
    if (registerUser.ok) {
      navigate(RouteUrl.CONFIRM);
      return;
    }

    document.querySelector("#register-error").removeAttribute("hidden");
  }

  passwdInput.addEventListener("input", (event) =>
    handleInput(event, isPasswordStrong)
  );
  passwdConfirmationInput.addEventListener("input", (event) =>
    handleInput(event, isMatchedPassword)
  );
  emailInput.addEventListener("input", (event) =>
    handleInput(event, isValidEmail)
  );

  signupBtn.addEventListener("click", handleSignUpFormSubmit);
};
