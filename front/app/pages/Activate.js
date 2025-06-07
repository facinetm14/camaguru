import { navigate, NAVIGATE_TO_PAGE } from "../scripts/events.js";
import { RouteUrl } from "../scripts/router.js";
import { userService } from "../usecases/userService.js";
export const Activate = () => {
  const [_, _path, validationToken] = window.location.pathname.split("/");

  (async () => {
    const resp = await userService.verify(validationToken);

    if (resp.ok) {
      return navigate(RouteUrl.HOME);
    }
    navigate(RouteUrl.NOT_FOUND);
  })();
};
