import { authApi } from "../api/auth.api.js";
import { navigate, NAVIGATE_TO_PAGE } from "../scripts/events.js";
import { RouteUrl } from "../scripts/router.js";

export const Activate = () => {
  const [_, _path, validationToken] = window.location.pathname.split("/");

  (async () => {
    const resp = await authApi.verify(validationToken);

    if (resp.ok) {
      return navigate(RouteUrl.HOME);
    }
    navigate(RouteUrl.NOT_FOUND);
  })();
};
