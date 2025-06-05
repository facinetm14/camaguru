import { IncomingMessage, ServerResponse } from "http";
import { factoryModule } from "../../../domain/utils/factory";
import { AllowedRoutes, API_BASE } from "../../enums/AllowedRoutes";
import { ModuleRegister } from "../../enums/ModuleRegister";
import { RequestError } from "../../enums/RequestError";
import { ResponseStatusCode } from "../../enums/ResponseStatusCode";
import { InputError } from "../../errors/inputError";
import { Router } from "./router";

export class Gateway {
  private registry: Map<AllowedRoutes, Router> = new Map();

  constructor() {
    this.registry.set(
      AllowedRoutes.USERS,
      factoryModule(ModuleRegister.USER_ROUTE)
    );
    this.registry.set(
      AllowedRoutes.BASE,
      factoryModule(ModuleRegister.BASE_ROUTE)
    );

    this.registry.set(
      AllowedRoutes.AUTH,
      factoryModule(ModuleRegister.AUTH_ROUTE)
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
