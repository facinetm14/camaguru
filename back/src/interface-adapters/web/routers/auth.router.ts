import { IncomingMessage, ServerResponse } from "http";
import { RouterStrategy } from "./routing-strategy";
import { TypeRoute } from "../types/route.type";
import { AuthController } from "../controllers/auth.controller";
import { RouterInterface } from "./router-interface";
import { ResponseStatusCode } from "../enum/response-status-code";
import { RoutesParamsKey } from "../enum/route-paramsKey";

export class AuthRouter extends RouterStrategy implements RouterInterface {
  private routes: TypeRoute[];

  constructor(private authController: AuthController) {
    super();
    this.routes = [
      {
        pattern: "/auth/register",
        method: "POST",
        handler: this.authController.register,
      },
      {
        pattern: `/auth/verify/:${RoutesParamsKey.VALIDATION_TOKEN}`,
        method: "POST",
        handler: this.authController.verify,
      },
      {
        pattern: "/auth/login",
        method: "POST",
        handler: this.authController.login,
      },
      {
        pattern: `/auth/logout/:${RoutesParamsKey.SESSION_ID}`,
        method: "PATCH",
        handler: this.authController.logout,
      },
      {
        pattern: "/auth/reset-password",
        method: "POST",
        handler: this.authController.resetPassword,
      },
      {
        pattern: "/auth/new-password",
        method: "PATCH",
        handler: this.authController.createNewPassword,
      },
    ];
  }

  async handleRoute(req: IncomingMessage, resp: ServerResponse): Promise<void> {
    return this.matchRoute(req, resp);
  }

  async matchRoute(req: IncomingMessage, resp: ServerResponse): Promise<void> {
    let matchedRoute = false;
    let matchedMethod = false;

    for (const route of this.routes) {
      const params = this.matchRoutePatterns(req.url ?? "", route.pattern);

      if (params) {
        matchedRoute = true;
      }

      if (params && route.method === req.method) {
        matchedMethod = true;
        route.handler.call(this.authController, { req, resp, params });
      }
    }

    if (!matchedRoute) {
      resp.statusCode = ResponseStatusCode.NOT_FOUND;
      resp.end();
    }

    if (!matchedMethod) {
      resp.statusCode = ResponseStatusCode.METHOD_NOT_ALLOWED;
      resp.end();
    }
  }
}
