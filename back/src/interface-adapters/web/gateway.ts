import { IncomingMessage, ServerResponse } from "http";
import { factoryModule } from "../../application/utils/factory-module";
import { API_BASE } from "./consts/api-base";
import { AllowedRoutes } from "./enum/allowed-routes";
import { ResponseStatusCode } from "./enum/response-status-code";
import { ClassRegistry } from "../../core/enum/class-registry";
import { Router } from "./types/router.type";

export class Gateway {
  private registry: Map<AllowedRoutes, Router> = new Map();

  constructor() {
    this.registry.set(
      AllowedRoutes.USERS,
      factoryModule(ClassRegistry.USER_ROUTE)
    );

    this.registry.set(
      AllowedRoutes.BASE,
      factoryModule(ClassRegistry.BASE_ROUTE)
    );

    this.registry.set(
      AllowedRoutes.AUTH,
      factoryModule(ClassRegistry.AUTH_ROUTE)
    );
    
  }

  async dispatch(req: IncomingMessage, resp: ServerResponse): Promise<void> {
    if (!req.url?.match(/^\/api\/v1\//)) {
      resp.statusCode = ResponseStatusCode.NOT_FOUND;
      return;
    }

    const baseRoute = req.url?.slice(API_BASE.length)?.split("/")[1] ?? "";
    if (this.isKnownRoute(baseRoute)) {
      return this.resolveRoute(
        req,
        resp,
        this.registry.get(baseRoute as AllowedRoutes)!
      );
    }

    resp.statusCode = ResponseStatusCode.NOT_FOUND;
    resp.end();
  }

  private isKnownRoute(route: string): boolean {
    return Object.values(AllowedRoutes).includes(route as AllowedRoutes);
  }

  private async resolveRoute(
    req: IncomingMessage,
    resp: ServerResponse,
    handler: Router
  ): Promise<void> {
    return handler.handleRoute(req, resp);
  }
}
