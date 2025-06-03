import { createServer, IncomingMessage, ServerResponse } from "http";
import { App } from "./app";
import { initDb } from "./database/initDb";
import { DIContainer } from "./infrastructure/di-container/container";
import { ModuleRegister } from "./infrastructure/enums/ModuleRegister";
import { AuthConcreteService } from "./domain/services/authConcreteService";
import { EmailConcreteService } from "./domain/services/emailConcreteService";
import { SessionConcreteService } from "./domain/services/sessionConcreteService";
import { UserConCreteService } from "./domain/services/userConcreteService";
import { SessionConcreteRepository } from "./infrastructure/adapters/sessionConcreteRepository";
import { UserConcreteRepository } from "./infrastructure/adapters/userConcreteRepository";
import { AuthController } from "./infrastructure/delivery/controllers/AuthController";
import { UserController } from "./infrastructure/delivery/controllers/UserController";
import { BaseRouter } from "./infrastructure/delivery/routes/baseRouter";
import { UserRouter } from "./infrastructure/delivery/routes/userRouter";
import { AuthRouter } from "./infrastructure/delivery/routes/authRouter";

const hostname = process.env.HOST || "0.0.0.0";
const port = process.env.PORT || 5000;

initDb();
const server = createServer((req: IncomingMessage, resp: ServerResponse) => {
  DIContainer.registerClass(ModuleRegister.BASE_ROUTE, new BaseRouter());
  DIContainer.registerClass(
    ModuleRegister.USER_REPOSITORY,
    new UserConcreteRepository()
  );

  DIContainer.registerClass(
    ModuleRegister.EMAIL_SERVICE,
    new EmailConcreteService()
  );

  DIContainer.registerClass(
    ModuleRegister.SESSION_REPOSITORY,
    new SessionConcreteRepository()
  );
  DIContainer.registerClass(
    ModuleRegister.SESSION_SERVICE,
    new SessionConcreteService(
      DIContainer.resolve(ModuleRegister.SESSION_REPOSITORY)
    )
  );

  DIContainer.registerClass(
    ModuleRegister.USER_SERVICE,
    new UserConCreteService(DIContainer.resolve(ModuleRegister.USER_REPOSITORY))
  );
  DIContainer.registerClass(
    ModuleRegister.USER_CONTROLLER,
    new UserController(
      DIContainer.resolve(ModuleRegister.USER_SERVICE),
      DIContainer.resolve(ModuleRegister.SESSION_SERVICE)
    )
  );

  DIContainer.registerClass(
    ModuleRegister.USER_ROUTE,
    new UserRouter(DIContainer.resolve(ModuleRegister.USER_CONTROLLER))
  );

  DIContainer.registerClass(
    ModuleRegister.AUTH_SERVICE,
    new AuthConcreteService(
      DIContainer.resolve(ModuleRegister.USER_SERVICE),
      DIContainer.resolve(ModuleRegister.EMAIL_SERVICE)
    )
  );

  DIContainer.registerClass(
    ModuleRegister.AUTH_CONTROLLER,
    new AuthController(
      DIContainer.resolve(ModuleRegister.AUTH_SERVICE),
      DIContainer.resolve(ModuleRegister.SESSION_SERVICE)
    )
  );

  DIContainer.registerClass(
    ModuleRegister.AUTH_ROUTE,
    new AuthRouter(DIContainer.resolve(ModuleRegister.AUTH_CONTROLLER))
  );

  const app = new App(req, resp);
  app.run();
});

server.listen(+port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
