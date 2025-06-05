import { Events } from "./scripts/enums.js";
import { routes } from "./scripts/router.js";
import { navigate } from "./scripts/events.js";
import { setGlobalState } from "./scripts/userStore.js";

[Events.NAVIGATE_TO_PAGE, Events.POP_STATE].forEach((event) => {
  window.addEventListener(event, async () => {
    renderApp();
  });
});

document.addEventListener("DOMContentLoaded", async () => {
  renderApp();
});

export async function renderApp() {
  const [_, path] = window.location.pathname.split("/");
  const target = path.length ? path : "/";

  const page = routes.get(target);

  if (!page) {
    navigate("/404");
    return;
  }

  await setGlobalState();
  page();
}