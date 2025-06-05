import { IncomingMessage, ServerResponse } from "http";
import { RouterStrategy } from "./routerStrategy";
import { IRouter } from "./IRouter";
import { ResponseStatusCode } from "../../enums/ResponseStatusCode";
import { UserController } from "../controllers/UserController";
import { routeType } from "./router";

export class UserRouter extends RouterStrategy implements IRouter {
  private routes: routeType[];

  constructor(private userController: UserController) {
    super();
    this.routes = [
      {
        pattern: "/users/images-all",
        method: "GET",
        handler: this.userController.findAllImages,
      },
      {
        pattern: "/users",
        method: "GET",
        handler: this.userController.findAll,
      },
      {
        pattern: "/users/:sessionId",
        method: "GET",
        handler: this.userController.findById,
      },
      {
        pattern: "/users/images",
        method: "POST",
        handler: this.userController.uploadImage,
      },
      {
        pattern: "/users/images/:filename",
        method: "GET",
        handler: this.userController.getImageByName,
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
