import { Events } from "./scripts/enums.js";
import {
  redirectToHomeOrDisplayPage,
  routes,
  RouteUrl,
} from "./scripts/router.js";
import { navigate } from "./scripts/events.js";
import { SESSION_ID_KEY } from "./scripts/consts.js";

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
  const page = routes.get(path);

  if (!page) {
    navigate(`/${RouteUrl.NOT_FOUND}`);
    return;
  }

  const sessionId = sessionStorage.getItem(SESSION_ID_KEY);
  await redirectToHomeOrDisplayPage(sessionId, path, page);
}
