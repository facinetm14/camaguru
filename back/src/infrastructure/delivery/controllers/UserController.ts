import { UserUniqKeys } from "../../../domain/enums/user.enums";
import { SessionService } from "../../../domain/usecases/sessionService";
import { UserService } from "../../../domain/usecases/userService";
import { uploadImageError } from "../../../domain/utils/errors/upload-image.error";
import { parseRequestBodyAndBuildUploadImageDto } from "../../../domain/utils/mappers/user-entity.mapper";
import { ResponseStatusCode } from "../../enums/ResponseStatusCode";
import { ControllerInputType } from "../types/controllerInputType";
import { readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { createReadStream, existsSync, statSync } from "node:fs";
import { UPLOAD_DEST } from "../../../domain/utils/consts";
import { getFileExtension } from "../../../domain/utils/files-utils";
import { MimeType } from "../../enums/mimeType";
import { IncomingMessage } from "node:http";
export class UserController {
  constructor(
    private userService: UserService,
    private sessionService: SessionService
  ) {}

  async findAll({ req, resp }: ControllerInputType): Promise<void> {
    const userId = await this.getUserIdFromRequest(req);
    if (!userId) {
      resp.statusCode = ResponseStatusCode.FORBIDDEN;
      resp.end();
      return;
    }

    resp.statusCode = ResponseStatusCode.GET_OK;
    resp.setHeader("Content-Type", "application/json");

    const users = await this.userService.findAll();

    resp.end(JSON.stringify(users));
  }

  async findById({ req, params, resp }: ControllerInputType): Promise<void> {
    if (!params?.has("sessionId")) {
      resp.statusCode = ResponseStatusCode.BAD_REQUEST;
      resp.end();
      return;
    }

    const sessionId = params.get("sessionId") as string;

    try {
      const userId = await this.sessionService.findUserIdFromSession(sessionId);
      if (!userId) {
        (resp.statusCode = ResponseStatusCode.FORBIDDEN), resp.end();
        return;
      }

      const user = await this.userService.findUserByUniqKey(
        UserUniqKeys.ID,
        userId
      );

      if (!user) {
        resp.statusCode = ResponseStatusCode.NOT_FOUND;
        resp.end("user not found");
        return;
      }

      const { passwd, salt, status, ...userWithNoPasswd } = user;

      resp.end(JSON.stringify(userWithNoPasswd));
    } catch (error) {
      console.log(error);
      resp.statusCode = ResponseStatusCode.SERVER_INTERNAL_ERROR;
      resp.end();
    }
  }

  private async getUserIdFromRequest(
    req?: IncomingMessage
  ): Promise<string | null> {
    const authHeader = req?.headers["authorization"];
    const sessionToken = authHeader?.split(" ")[1];
    if (!sessionToken) {
      return null;
    }

    const userId = await this.sessionService.findUserIdFromSession(
      sessionToken
    );

    if (!userId) {
      return null;
    }

    return userId;
  }

  async uploadImage({ req, resp }: ControllerInputType): Promise<void> {
    const userId = await this.getUserIdFromRequest(req);
    if (!userId) {
      resp.statusCode = ResponseStatusCode.FORBIDDEN;
      resp.end();
      return;
    }

    let body = "";

    req?.on("data", (chunk) => {
      body += chunk.toString();
    });

    req?.on("end", async () => {
      const uploadImageDtoResult = parseRequestBodyAndBuildUploadImageDto(
        JSON.parse(body)
      );

      if (uploadImageDtoResult.isErr) {
        const error = uploadImageDtoResult.error;

        resp.statusCode = ResponseStatusCode.BAD_REQUEST;
        resp.end(error);
        return;
      }

      const imageDto = uploadImageDtoResult.data;

      try {
        const path = join(process.cwd(), UPLOAD_DEST, imageDto.filename);
        await writeFile(path, Buffer.from(imageDto.image, "base64"));
        await this.userService.saveImage(userId, imageDto.filename);
        resp.statusCode = ResponseStatusCode.CREATED_OK;
        resp.end("file uploaded successfully.");
      } catch (_error) {
        resp.statusCode = ResponseStatusCode.SERVER_INTERNAL_ERROR;
        resp.end(uploadImageError.UNKNOWN_ERROR);
      }
    });
  }

  async findAllImages({
    req,
    params,
    resp,
  }: ControllerInputType): Promise<void> {
    const connectedUser = await this.getUserIdFromRequest(req);

    if (!connectedUser) {
      resp.statusCode = ResponseStatusCode.FORBIDDEN;
      resp.end();
      return;
    }

    const images = await this.userService.findAllImages();
    resp.statusCode = ResponseStatusCode.GET_OK;
    resp.end(JSON.stringify(images));
  }

  async getImageByName({
    req,
    params,
    resp,
  }: ControllerInputType): Promise<void> {
    const filename = params?.get("filename");
    if (!filename) {
      resp.statusCode = ResponseStatusCode.BAD_REQUEST;
      resp.end();
      return;
    }

    const path = join(process.cwd(), UPLOAD_DEST, filename);
    if (!existsSync(path)) {
      resp.statusCode = ResponseStatusCode.NOT_FOUND;
      resp.end("image not found");
      return;
    }

    const fileStream = createReadStream(path);
    const type = MimeType.get(getFileExtension(path));
    if (!type) {
      resp.statusCode = ResponseStatusCode.BAD_REQUEST;
      resp.end("Invalid type");
      return;
    }

    resp.writeHead(ResponseStatusCode.GET_OK, {
      "Content-Type": `image/${type}`,
      "Content-Length": statSync(path).size,
    });

    fileStream.pipe(resp);
  }
}
