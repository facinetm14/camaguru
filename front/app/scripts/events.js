import { Events } from "./enums.js";

export const NAVIGATE_TO_PAGE = new CustomEvent(Events.NAVIGATE_TO_PAGE, {
  bubbles: true,
  cancelable: true,
});

export const navigate = (to) => {
  history.pushState(null, null, to);
  window.dispatchEvent(NAVIGATE_TO_PAGE);
};
