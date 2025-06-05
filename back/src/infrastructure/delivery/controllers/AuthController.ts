import { ServerResponse } from "http";
import { CreateUserDto } from "../../../domain/dtos/createUserDto";
import { UserLoginDto } from "../../../domain/dtos/userLoginDto";
import {
  AuthService,
  UserVeryficationStatus,
} from "../../../domain/usecases/authService";
import { SessionService } from "../../../domain/usecases/sessionService";
import { UserLoginError } from "../../../domain/utils/errors/user-login.error";
import { UserVerificationError } from "../../../domain/utils/errors/user-verificatio.error";
import {
  parseRequestBodyAndBuildCreateUserDto,
  parseRequestBodyAndBuildLoginUserDto,
} from "../../../domain/utils/mappers/user-entity.mapper";
import { uuid } from "../../../domain/utils/uuid";
import { isValidEmail } from "../../../domain/utils/validation/email";
import { isNotEmptyString } from "../../../domain/utils/validation/string";
import { ResponseStatusCode } from "../../enums/ResponseStatusCode";
import { ControllerInputType } from "../types/controllerInputType";

export class AuthController {
  constructor(
    private authService: AuthService,
    private sessionService: SessionService
  ) {}

  async register({ req, resp }: ControllerInputType): Promise<void> {
    let body = "";

    req?.on("data", (chunk) => {
      body += chunk.toString();
    });

    req?.on("end", async () => {
      const createUserDtoResult = parseRequestBodyAndBuildCreateUserDto(
        JSON.parse(body)
      );

      if (createUserDtoResult.isErr) {
        resp.statusCode = ResponseStatusCode.BAD_REQUEST;
        resp.end(`Invalid Request Body : ${createUserDtoResult.error}`);
        return;
      }

      const newUserResult = await this.authService.register(
        createUserDtoResult.data
      );

      if (newUserResult.isErr) {
        resp.statusCode = ResponseStatusCode.SERVER_INTERNAL_ERROR;
        resp.end(newUserResult.error);
        return;
      }

      resp.statusCode = ResponseStatusCode.CREATED_OK;
      resp.end();
    });
  }

  async verify({ resp, params }: ControllerInputType) {
    if (!params?.has("token")) {
      resp.statusCode = ResponseStatusCode.BAD_REQUEST;
      resp.end(UserVerificationError.TOKEN_UNDEFINED);
      return;
    }
    const token = params.get("token");

    if (!isNotEmptyString(token)) {
      resp.statusCode = ResponseStatusCode.BAD_REQUEST;
      resp.end(UserVerificationError.INVALID_TOKEN);
      return;
    }

    const userVerifcationResult = await this.authService.verify(token!);
    if (userVerifcationResult.isErr) {
      resp.statusCode = ResponseStatusCode.INVALID_CREDENTIALS;
      resp.end(UserVerificationError.INVALID_TOKEN);
      return;
    }

    resp.statusCode = ResponseStatusCode.CREATED_OK;
    resp.end();
  }

  async login({ req, resp }: ControllerInputType): Promise<void> {
    let body = "";

    req?.on("data", (chunk) => {
      body += chunk.toString();
    });

    req?.on("end", async () => {
      const loginUserDtoResult = parseRequestBodyAndBuildLoginUserDto(
        JSON.parse(body)
      );

      if (loginUserDtoResult.isErr) {
        resp.statusCode = ResponseStatusCode.BAD_REQUEST;
        resp.end(loginUserDtoResult.error);
        return;
      }

      const userSignResult = await this.authService.signin(
        loginUserDtoResult.data
      );
      if (!userSignResult.isErr) {
        const userId = userSignResult.data;
        const authToken = uuid("session");

        await this.sessionService.register({ id: authToken, userId });

        resp.statusCode = ResponseStatusCode.GET_OK;
        resp.end(JSON.stringify({ sessionId: authToken }));

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

  async logout({ req, resp, params }: ControllerInputType) {
    if (!params?.has("sessionId")) {
      resp.statusCode = ResponseStatusCode.BAD_REQUEST;
      resp.end();
      return;
    }

    const sessionId = params.get("sessionId") as string;

    try {
      await this.sessionService.delete(sessionId);
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
        const email = JSON.parse(body);
        if (!isNotEmptyString(email) || isValidEmail(email)) {
          resp.statusCode = ResponseStatusCode.BAD_REQUEST;
          resp.end();
          return;
        }

        const userId = await this.authService.resetPassword(email);

        if (!userId) {
          resp.statusCode = ResponseStatusCode.INVALID_CREDENTIALS;
          resp.end("invalid credentials");
          return;
        }

        resp.statusCode = ResponseStatusCode.CREATED_OK;
        resp.end();
      })();
    });
  }
}
