import userStore from "../scripts/userStore.js";

export const EditUserInfos = () => {
  const root = document.querySelector("#app");
  const { user } = userStore.getState();

  const template = `
  <div>
    <nav class="navbar navbar-light profile-topBar">
      <a class="navbar-brand" href="/">
        <img src="${PLAIN_API_BASE_ROUTE}/users/images/logo.png" width="60" height="60" alt="">
      </a>
      <div class="navbar-text">
        <div class="username-label" id="username-label"></div>
        <div class="user-profile-dropdown-menu" id="profile-dropdownMenu">
          <ul>
            <li><a href="${RouteUrl.EDIT_INFOS}">edit-infos</a></li>
            <li><a href="" id="logout">Logout</a></li>
          </ul>
        </div>
  
      </div>
    </nav>
    <div class="signup-container">
    
    </div>
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

  root.innerHTML = template;
};
