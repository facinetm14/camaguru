import { Events } from "./scripts/enums.js";
import { routes } from "./scripts/router.js";
import { navigate } from "./scripts/events.js";

[Events.NAVIGATE_TO_PAGE, Events.POP_STATE].forEach((event) => {
  window.addEventListener(event, () => {
    renderApp();
  });
});

document.addEventListener("DOMContentLoaded", () => {
  renderApp();
});

export function renderApp() {
  const [_, path] = window.location.pathname.split("/");
  const target = path.length ? path : "/";

  const page = routes.get(target);

  if (!page) {
    navigate("/404");
    return;
  }

  page();
}
