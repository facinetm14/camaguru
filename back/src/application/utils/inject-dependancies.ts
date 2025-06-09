import { ClassRegistry } from "../../core/enum/class-registry";
import { USerSessionRepository } from "../../infrastructure/repositories/user-session.repository";
import { UserRepository } from "../../infrastructure/repositories/user.repository";
import { EmailService } from "../../infrastructure/services/email.service";
import { AuthController } from "../../interface-adapters/web/controllers/auth.controller";
import { UserController } from "../../interface-adapters/web/controllers/user.controller";
import { AuthRouter } from "../../interface-adapters/web/routers/auth.router";
import { BaseRouter } from "../../interface-adapters/web/routers/base-router";
import { UserRouter } from "../../interface-adapters/web/routers/user.router";
import { DIContainer } from "../../shared/di.container";
import { LoginUserUseCase } from "../usecases/auth/login-user.usecase";
import { RegisterUserUseCase } from "../usecases/auth/register-user.usecase";
import { VerifyUserUseCase } from "../usecases/auth/verify-user.usecase";

export function injectDependancies() {
  DIContainer.subscribe(ClassRegistry.BASE_ROUTE, new BaseRouter());
  DIContainer.subscribe(ClassRegistry.USER_REPOSITORY, new UserRepository());
  DIContainer.subscribe(ClassRegistry.EMAIL_SERVICE, new EmailService());

  DIContainer.subscribe(
    ClassRegistry.RESGISTER_USER_USECASE,
    new RegisterUserUseCase(
      DIContainer.resolve(ClassRegistry.USER_REPOSITORY),
      DIContainer.resolve(ClassRegistry.EMAIL_SERVICE)
    )
  );

  DIContainer.subscribe(
    ClassRegistry.VERYFY_USER_USECASE,
    new VerifyUserUseCase(DIContainer.resolve(ClassRegistry.USER_REPOSITORY))
  );

  DIContainer.subscribe(
    ClassRegistry.SESSION_REPOSITORY,
    new USerSessionRepository()
  );

  DIContainer.subscribe(
    ClassRegistry.USER_ROUTE,
    new UserRouter(DIContainer.resolve(ClassRegistry.USER_CONTROLLER))
  );

  DIContainer.subscribe(
    ClassRegistry.LOGIN_USER_USECASE,
    new LoginUserUseCase(
      DIContainer.resolve(ClassRegistry.USER_REPOSITORY),
      DIContainer.resolve(ClassRegistry.SESSION_REPOSITORY)
    )
  );

  DIContainer.subscribe(
    ClassRegistry.AUTH_CONTROLLER,
    new AuthController(
      DIContainer.resolve(ClassRegistry.RESGISTER_USER_USECASE),
      DIContainer.resolve(ClassRegistry.VERYFY_USER_USECASE),
      DIContainer.resolve(ClassRegistry.LOGIN_USER_USECASE),
      DIContainer.resolve(ClassRegistry.LOGOUT_USER_USECASE),
      DIContainer.resolve(ClassRegistry.RESET_USER_PASSWORD_USECASE),
      DIContainer.resolve(ClassRegistry.CREATE_NEW_USER_PASSWORD_USECASE)
    )
  );

  DIContainer.subscribe(
    ClassRegistry.AUTH_ROUTE,
    new AuthRouter(DIContainer.resolve(ClassRegistry.AUTH_CONTROLLER))
  );
}
