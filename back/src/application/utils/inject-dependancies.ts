import { ClassRegistry } from "../../core/enum/class-registry";
import { CommentImageRepository } from "../../infrastructure/repositories/comment-image.repository";
import { LikeImageRepository } from "../../infrastructure/repositories/like-image.repository";
import { UserImageRepository } from "../../infrastructure/repositories/user-image.repository";
import { USerSessionRepository } from "../../infrastructure/repositories/user-session.repository";
import { UserRepository } from "../../infrastructure/repositories/user.repository";
import { EmailService } from "../../infrastructure/services/email.service";
import { AuthController } from "../../adapters/web/controllers/auth.controller";
import { UserController } from "../../adapters/web/controllers/user.controller";
import { AuthRouter } from "../../adapters/web/routers/auth.router";
import { BaseRouter } from "../../adapters/web/routers/base-router";
import { UserRouter } from "../../adapters/web/routers/user.router";
import { DIContainer } from "../../shared/di.container";
import { LoginUserUseCase } from "../usecases/auth/login-user.usecase";
import { LogoutUserUseCase } from "../usecases/auth/logout-user.usecase";
import { RegisterUserUseCase } from "../usecases/auth/register-user.usecase";
import { VerifyUserUseCase } from "../usecases/auth/verify-user.usecase";
import { CommentImageUseCase } from "../usecases/users/comment-image-usecase";
import { CreateNewUserPasswordUseCase } from "../usecases/users/create-new-user-password.usecase";
import { FindAllUsersImagesUseCase } from "../usecases/users/find-all-users-images.usecase";
import { FindUserInfosUseCase } from "../usecases/users/find-user-infos.usecase";
import { GetImageLikesUseCase } from "../usecases/users/get-image-likes-usecase";
import { LikeImageUseCase } from "../usecases/users/like-image.usecase";
import { ResetUserPasswordUseCase } from "../usecases/users/reset-user-password.usecase";
import { SaveUserImageUseCase } from "../usecases/users/save-user-image.usecase";
import { UpdateUserInfosUseCase } from "../usecases/users/update-user-infos.usecase";

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
    ClassRegistry.USER_SESSION_REPOSITORY,
    new USerSessionRepository()
  );

  DIContainer.subscribe(
    ClassRegistry.USER_IMAGES_REPOSITORY,
    new UserImageRepository()
  );

  DIContainer.subscribe(
    ClassRegistry.FIND_ALL_USERS_IMAGES_USECASE,
    new FindAllUsersImagesUseCase(
      DIContainer.resolve(ClassRegistry.USER_IMAGES_REPOSITORY)
    )
  );

  DIContainer.subscribe(
    ClassRegistry.FIND_USER_INFOS_USECASE,
    new FindUserInfosUseCase(
      DIContainer.resolve(ClassRegistry.USER_REPOSITORY),
      DIContainer.resolve(ClassRegistry.USER_SESSION_REPOSITORY)
    )
  );

  DIContainer.subscribe(
    ClassRegistry.SAVE_USER_IMAGE_USECASE,
    new SaveUserImageUseCase(
      DIContainer.resolve(ClassRegistry.USER_IMAGES_REPOSITORY)
    )
  );

  DIContainer.subscribe(
    ClassRegistry.UPDATE_USER_INFOS_USECASE,
    new UpdateUserInfosUseCase(
      DIContainer.resolve(ClassRegistry.USER_REPOSITORY)
    )
  );

  DIContainer.subscribe(
    ClassRegistry.LIKE_IMAGE_REPOSITORY,
    new LikeImageRepository()
  );

  DIContainer.subscribe(
    ClassRegistry.LIKE_IMAGE_USECASE,
    new LikeImageUseCase(
      DIContainer.resolve(ClassRegistry.USER_IMAGES_REPOSITORY),
      DIContainer.resolve(ClassRegistry.LIKE_IMAGE_REPOSITORY)
    )
  );

  DIContainer.subscribe(
    ClassRegistry.GET_IMAGE_LIKES_USECASE,
    new GetImageLikesUseCase(
      DIContainer.resolve(ClassRegistry.LIKE_IMAGE_REPOSITORY)
    )
  );

  DIContainer.subscribe(
    ClassRegistry.COMMENT_IMAGE_REPOSITORY,
    new CommentImageRepository()
  );
  DIContainer.subscribe(
    ClassRegistry.COMMENT_IMAGE_USECASE,
    new CommentImageUseCase(
      DIContainer.resolve(ClassRegistry.USER_IMAGES_REPOSITORY),
      DIContainer.resolve(ClassRegistry.COMMENT_IMAGE_REPOSITORY),
      DIContainer.resolve(ClassRegistry.USER_REPOSITORY),
      DIContainer.resolve(ClassRegistry.EMAIL_SERVICE)
    )
  );

  DIContainer.subscribe(
    ClassRegistry.USER_CONTROLLER,
    new UserController(
      DIContainer.resolve(ClassRegistry.FIND_ALL_USERS_IMAGES_USECASE),
      DIContainer.resolve(ClassRegistry.SAVE_USER_IMAGE_USECASE),
      DIContainer.resolve(ClassRegistry.FIND_USER_INFOS_USECASE),
      DIContainer.resolve(ClassRegistry.UPDATE_USER_INFOS_USECASE),
      DIContainer.resolve(ClassRegistry.LIKE_IMAGE_USECASE),
      DIContainer.resolve(ClassRegistry.GET_IMAGE_LIKES_USECASE),
      DIContainer.resolve(ClassRegistry.COMMENT_IMAGE_USECASE)
    )
  );

  DIContainer.subscribe(
    ClassRegistry.USER_ROUTE,
    new UserRouter(DIContainer.resolve(ClassRegistry.USER_CONTROLLER))
  );

  DIContainer.subscribe(
    ClassRegistry.LOGIN_USER_USECASE,
    new LoginUserUseCase(
      DIContainer.resolve(ClassRegistry.USER_REPOSITORY),
      DIContainer.resolve(ClassRegistry.USER_SESSION_REPOSITORY)
    )
  );

  DIContainer.subscribe(
    ClassRegistry.CREATE_NEW_USER_PASSWORD_USECASE,
    new CreateNewUserPasswordUseCase(
      DIContainer.resolve(ClassRegistry.USER_REPOSITORY)
    )
  );

  DIContainer.subscribe(
    ClassRegistry.RESET_USER_PASSWORD_USECASE,
    new ResetUserPasswordUseCase(
      DIContainer.resolve(ClassRegistry.USER_REPOSITORY),
      DIContainer.resolve(ClassRegistry.EMAIL_SERVICE)
    )
  );

  DIContainer.subscribe(
    ClassRegistry.LOGOUT_USER_USECASE,
    new LogoutUserUseCase(
      DIContainer.resolve(ClassRegistry.USER_SESSION_REPOSITORY)
    )
  );

  DIContainer.subscribe(
    ClassRegistry.AUTH_CONTROLLER,
    new AuthController(
      DIContainer.resolve(ClassRegistry.RESGISTER_USER_USECASE),
      DIContainer.resolve(ClassRegistry.VERYFY_USER_USECASE),
      DIContainer.resolve(ClassRegistry.LOGIN_USER_USECASE),
      DIContainer.resolve(ClassRegistry.RESET_USER_PASSWORD_USECASE),
      DIContainer.resolve(ClassRegistry.LOGOUT_USER_USECASE),
      DIContainer.resolve(ClassRegistry.CREATE_NEW_USER_PASSWORD_USECASE)
    )
  );

  DIContainer.subscribe(
    ClassRegistry.AUTH_ROUTE,
    new AuthRouter(DIContainer.resolve(ClassRegistry.AUTH_CONTROLLER))
  );
}
