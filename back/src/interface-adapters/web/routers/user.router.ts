import { IncomingMessage, ServerResponse } from "http";
import { RouterInterface } from "./router-interface";
import { RouterStrategy } from "./routing-strategy";
import { UserController } from "../controllers/user.controller";
import { ResponseStatusCode } from "../enum/response-status-code";
import { TypeRoute } from "../types/route.type";
import { RoutesParamsKey } from "../enum/route-paramsKey";

export class UserRouter extends RouterStrategy implements RouterInterface {
  private routes: TypeRoute[];

  constructor(private userController: UserController) {
    super();
    this.routes = [
      {
        pattern: `/users/images/:${RoutesParamsKey.FILE_NAME}`,
        method: "GET",
        handler: this.userController.getImageByName,
      },
      {
        pattern: "/users/images",
        method: "GET",
        handler: this.userController.findAllImages,
      },
      {
        pattern: "/users/images",
        method: "POST",
        handler: this.userController.uploadImage,
      },
      {
        pattern: `/users/:${RoutesParamsKey.SESSION_ID}`,
        method: "GET",
        handler: this.userController.findByIdSession,
      },
      {
        pattern: `/users/:${RoutesParamsKey.SESSION_ID}`,
        method: "PATCH",
        handler: this.userController.updateUserInfos,
      },
      {
        pattern: "/users",
        method: "GET",
        handler: this.userController.findAll,
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
        route.handler.call(this.userController, { req, resp, params });
        return;
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
