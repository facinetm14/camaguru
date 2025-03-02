import { CreateUserDto } from "../../../domain/dtos/createUserDto";
import { UserLoginDto } from "../../../domain/dtos/userLoginDto";
import { AuthService } from "../../../domain/usecases/authService";
import { SessionService } from "../../../domain/usecases/sessionService";
import { RegistrationError } from "../../../domain/utils/errors/registration.error";
import {
  parseRequestBodyAndBuildCreateUserDto,
  parseRequestBodyAndBuildLoginUserDto,
} from "../../../domain/utils/mappers/user-entity.mapper";
import { uuid } from "../../../domain/utils/uuid";
import { isValidEmail } from "../../../domain/utils/validation/email";
import { isString } from "../../../domain/utils/validation/string";
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
      try {
        const result = parseRequestBodyAndBuildCreateUserDto(JSON.parse(body));

        if (
          Object.values(RegistrationError).includes(result as RegistrationError)
        ) {
          resp.statusCode = ResponseStatusCode.BAD_REQUEST;
          resp.end(`Invalid Request Body : ${result}`);
          return;
        }

        const createUserDto = result as CreateUserDto;
        const newUser = await this.authService.register(createUserDto);

        if (!newUser) {
          resp.statusCode = ResponseStatusCode.SERVER_INTERNAL_ERROR;
          resp.end();
          return;
        }

        resp.statusCode = ResponseStatusCode.CREATED_OK;
        resp.end();
      } catch (error) {
        resp.statusCode = ResponseStatusCode.BAD_REQUEST;
        resp.end();
        console.log(error);
      }
    });
  }

  async verify({ resp, params }: ControllerInputType) {
    if (!params?.has("token")) {
      resp.statusCode = ResponseStatusCode.BAD_REQUEST;
      resp.end();
      return;
    }
    const token = params.get("token");

    if (!token || typeof token !== "string") {
      resp.statusCode = ResponseStatusCode.BAD_REQUEST;
      resp.end();
      return;
    }

    try {
      await this.authService.verify(token);
      resp.statusCode = ResponseStatusCode.CREATED_OK;
    } catch (error) {
      console.log(`${error},  ${token}`);
      resp.statusCode = ResponseStatusCode.BAD_REQUEST;
    }
    resp.end();
  }

  async login({ req, resp }: ControllerInputType): Promise<void> {
    let body = "";
    req?.on("data", (chunk) => {
      body += chunk.toString();
    });

    req?.on("end", () => {
      (async () => {
        const loginUserDto = parseRequestBodyAndBuildLoginUserDto(
          JSON.parse(body)
        );

        if (!loginUserDto) {
          resp.statusCode = ResponseStatusCode.BAD_REQUEST;
          resp.end();
          return;
        }

        const userId = await this.authService.signin(loginUserDto);
        if (!userId) {
          resp.statusCode = ResponseStatusCode.INVALID_CREDENTIALS;
          resp.end("invalid credentials");
          return;
        }

        const authToken = uuid("session");

        await this.sessionService.register({ id: authToken, userId });

        resp.statusCode = ResponseStatusCode.GET_OK;
        resp.end(JSON.stringify({ sessionId: authToken }));
      })();
    });
  }

  async logout({ resp, params }: ControllerInputType) {
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
        if (!isString(email) || isValidEmail(email)) {
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
