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
        pattern: `/users/images/:${RoutesParamsKey.IMAGE_ID}/comment`,
        method: "POST",
        handler: this.userController.commentImage,
      },
      {
        pattern: `/users/images/:${RoutesParamsKey.IMAGE_ID}/likes`,
        method: "POST",
        handler: this.userController.likeUserImages,
      },
      {
        pattern: `/users/images/:${RoutesParamsKey.IMAGE_ID}/likes`,
        method: "GET",
        handler: this.userController.findImageLikes,
      },
      {
        pattern: `/users/images/:${RoutesParamsKey.IMAGE_ID}`,
        method: "DELETE",
        handler: this.userController.deleteUserImage,
      },
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
        pattern: "/users/combine-images",
        method: "POST",
        handler: this.userController.combineImages,
      },
      {
        pattern: `/users/exists`,
        method: "POST",
        handler: this.userController.doesEmailExists,
      },
      {
        pattern: `/users/:${RoutesParamsKey.USER_NAME}/exists`,
        method: "GET",
        handler: this.userController.doesUserNameExists,
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
