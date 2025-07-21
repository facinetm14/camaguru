import { authApi } from "../api/auth.api.js";
import { navigate } from "../scripts/events.js";
import { RouteUrl } from "../scripts/router.js";

export const Activate = () => {
  const [_, _path, validationToken] = window.location.pathname.split("/");

  (async () => {
    const resp = await authApi.verify(validationToken);

    if (resp.ok) {
      navigate(`/${RouteUrl.HOME}`);
      return;
    }
    navigate(RouteUrl.NOT_FOUND);
  })();
};
