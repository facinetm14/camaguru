import { ServerResponse } from "http";
import { ControllerInputType } from "../types/controller-input.type";
import {
  buildCreateNewUserPasswordDto,
  buildCreateUserDtoFromRequestBody,
  buildResetPasswordDtoFromRequestBody,
  buildUserLoginDtoFromRequestBody,
} from "../mappers/user.mapper";
import { ResponseStatusCode } from "../enum/response-status-code";
import { RegisterUserUseCase } from "../../../application/usecases/auth/register-user.usecase";
import { UserVerificationError } from "../../../core/error/user-verificatio.error";
import { isNotEmptyString } from "../../../shared/string";
import { VerifyUserUseCase } from "../../../application/usecases/auth/verify-user.usecase";
import { LoginUserUseCase } from "../../../application/usecases/auth/login-user.usecase";
import { RoutesParamsKey } from "../enum/route-paramsKey";
import { UserLoginError } from "../../../core/error/user-login.error";
import { ResetUserPasswordUseCase } from "../../../application/usecases/users/reset-user-password.usecase";
import { ActionStatus } from "../../../core/enum/action-status";
import { LogoutUserUseCase } from "../../../application/usecases/auth/logout-user.usecase";
import { CreateNewUserPasswordUseCase } from "../../../application/usecases/users/create-new-user-password.usecase";
import { parseRequestBodyAsJson } from "../../../shared/parse-request-body";

export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly verifyUserUseCase: VerifyUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly resetUserPasswordUsecase: ResetUserPasswordUseCase,
    private readonly logoutUserUseCase: LogoutUserUseCase,
    private readonly CreateNewUserPasswordUsecase: CreateNewUserPasswordUseCase
  ) {}

  async register({ req, resp }: ControllerInputType): Promise<void> {
    let body = "";

    req?.on("data", (chunk) => {
      body += chunk.toString();
    });

    req?.on("end", async () => {
      const requestBody = parseRequestBodyAsJson(body);
      if (requestBody.isErr) {
        resp.statusCode = ResponseStatusCode.BAD_REQUEST;
        resp.end();
        return;
      }

      const createUserDtoResult = await buildCreateUserDtoFromRequestBody(
        requestBody.data
      );

      if (createUserDtoResult.isErr) {
        resp.statusCode = ResponseStatusCode.BAD_REQUEST;
        resp.end(`Invalid Request Body : ${createUserDtoResult.error}`);
        return;
      }

      const newUserResult = await this.registerUserUseCase.execute(
        createUserDtoResult.data
      );

      if (newUserResult.isErr) {
        resp.statusCode = ResponseStatusCode.BAD_REQUEST;
        resp.end(newUserResult.error);
        return;
      }

      resp.statusCode = ResponseStatusCode.SERVER_INTERNAL_ERROR;
      resp.end();
    });
  }

  async verify({ resp, params }: ControllerInputType) {
    if (!params?.has(RoutesParamsKey.VALIDATION_TOKEN)) {
      resp.statusCode = ResponseStatusCode.BAD_REQUEST;
      resp.end(UserVerificationError.TOKEN_UNDEFINED);
      return;
    }
    const token = params.get(RoutesParamsKey.VALIDATION_TOKEN);

    if (!isNotEmptyString(token)) {
      resp.statusCode = ResponseStatusCode.BAD_REQUEST;
      resp.end(UserVerificationError.INVALID_TOKEN);
      return;
    }

    const userVerifcationResult = await this.verifyUserUseCase.execute(token!);
    if (userVerifcationResult.isErr) {
      resp.statusCode = ResponseStatusCode.INVALID_CREDENTIALS;
      resp.end(UserVerificationError.INVALID_TOKEN);
      return;
    }

    resp.statusCode = ResponseStatusCode.CREATED_OK;
    resp.end(JSON.stringify(userVerifcationResult.data));
  }

  async login({ req, resp }: ControllerInputType): Promise<void> {
    let body = "";

    req?.on("data", (chunk) => {
      body += chunk.toString();
    });

    req?.on("end", async () => {
      const requestBody = parseRequestBodyAsJson(body);
      if (requestBody.isErr) {
        resp.statusCode = ResponseStatusCode.BAD_REQUEST;
        resp.end();
        return;
      }

      const loginUserDtoResult = buildUserLoginDtoFromRequestBody(
        requestBody.data
      );

      if (loginUserDtoResult.isErr) {
        resp.statusCode = ResponseStatusCode.BAD_REQUEST;
        resp.end(loginUserDtoResult.error);
        return;
      }

      const userSignResult = await this.loginUserUseCase.execute(
        loginUserDtoResult.data
      );

      if (!userSignResult.isErr) {
        resp.statusCode = ResponseStatusCode.GET_OK;
        const sessionId = userSignResult.data;
        resp.end(JSON.stringify({ sessionId }));
        return;
      }

      const error = userSignResult.error;
      console.log({ error });
      this.handleLoginError(resp, error);
    });
  }

  private handleLoginError(resp: ServerResponse, error: UserLoginError) {
    switch (error) {
      case UserLoginError.INVALID_CREDENTIALS:
        resp.statusCode = ResponseStatusCode.INVALID_CREDENTIALS;
        break;
      case UserLoginError.USER_NOT_FOUND:
        resp.statusCode = ResponseStatusCode.NOT_FOUND;
        break;
      case UserLoginError.USER_EMAIL_NOT_VERIFIED:
        resp.statusCode = ResponseStatusCode.FORBIDDEN;
        break;
      default:
        resp.statusCode = ResponseStatusCode.SERVER_INTERNAL_ERROR;
    }
    resp.end(error);
  }

  async logout({ resp, params }: ControllerInputType) {
    if (!params?.has(RoutesParamsKey.SESSION_ID)) {
      resp.statusCode = ResponseStatusCode.BAD_REQUEST;
      resp.end();
      return;
    }

    const sessionId = params.get(RoutesParamsKey.SESSION_ID) as string;

    try {
      await this.logoutUserUseCase.execute(sessionId);
      resp.statusCode = ResponseStatusCode.GET_OK;
    } catch (error) {
      resp.statusCode = ResponseStatusCode.BAD_REQUEST;
    }
    resp.end();
  }

  async resetPassword({ req, resp }: ControllerInputType): Promise<void> {
    let body = "";
    req?.on("data", (chunk) => {
      body += chunk.toString();
    });

    req?.on("end", () => {
      (async () => {
        const requestBody = parseRequestBodyAsJson(body);
        if (requestBody.isErr) {
          resp.statusCode = ResponseStatusCode.BAD_REQUEST;
          resp.end();
          return;
        }

        const emailResult = buildResetPasswordDtoFromRequestBody(
          requestBody.data
        );

        if (emailResult.isErr) {
          resp.statusCode = ResponseStatusCode.BAD_REQUEST;
          resp.end();
          return;
        }

        const userRessetPasswdResult =
          await this.resetUserPasswordUsecase.execute(emailResult.data);

        if (userRessetPasswdResult !== ActionStatus.SUCCESS) {
          resp.statusCode = ResponseStatusCode.NOT_FOUND;
          resp.end("user not found");
          return;
        }

        resp.statusCode = ResponseStatusCode.CREATED_OK;
        resp.end();
      })();
    });
  }

  async createNewPassword({ req, resp }: ControllerInputType): Promise<void> {
    let body = "";

    req?.on("data", (chunk) => {
      body += chunk.toString();
    });

    req?.on("end", async () => {
      const requestBody = parseRequestBodyAsJson(body);
      if (requestBody.isErr) {
        resp.statusCode = ResponseStatusCode.BAD_REQUEST;
        resp.end();
        return;
      }

      const createNewPasswordDtoResult = await buildCreateNewUserPasswordDto(
        requestBody.data
      );

      if (createNewPasswordDtoResult.isErr) {
        resp.statusCode = ResponseStatusCode.BAD_REQUEST;
        resp.end(createNewPasswordDtoResult.error);
        return;
      }

      const newPasswordResult = await this.CreateNewUserPasswordUsecase.execute(
        createNewPasswordDtoResult.data
      );

      if (newPasswordResult === ActionStatus.FAILED) {
        resp.statusCode = ResponseStatusCode.FORBIDDEN;
        resp.end();
        return;
      }

      resp.statusCode = ResponseStatusCode.CREATED_OK;
      resp.end();
    });
  }
}
