export const NotFound = () => {
  const root = document.querySelector("#app");

  const template =  `
    <div>404 Not Found</div>
  `;

  root.innerHTML = template;
};
