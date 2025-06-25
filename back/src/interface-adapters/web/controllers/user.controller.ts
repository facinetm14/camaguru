import { writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { createReadStream, existsSync, statSync } from "node:fs";
import { IncomingMessage } from "node:http";
import { UserUniqKeys } from "../../../core/enum/user.enum";
import { uploadImageError } from "../../../core/error/upload-image.error";
import { ResponseStatusCode } from "../enum/response-status-code";
import { ControllerInputType } from "../types/controller-input.type";
import { FindAllUsersImagesUseCase } from "../../../application/usecases/users/find-all-users-images.usecase";
import { AcceptedMimeType } from "../../../core/consts/accepted-file-type";
import { extractFileExtension } from "../../../shared/extract-file-extension";
import { RoutesParamsKey } from "../enum/route-paramsKey";
import { buildSaveImageDtoFromRequestBody } from "../mappers/user-image.mapper";
import { SaveUserImageUseCase } from "../../../application/usecases/users/save-user-image.usecase";
import { FindUserInfosByIdSessionUsecase } from "../../../application/usecases/users/find-user-infos-by-session.usecase";
import { UPLOAD_DEST } from "../../../core/consts/upload-destination";
import { buildUpdateUserInfosFromUpdateRequest } from "../mappers/user.mapper";
import { UpdateUserInfosUseCase } from "../../../application/usecases/users/update-user-infos.usecase";
import { LikeImageUseCase } from "../../../application/usecases/users/like-image.usecase";
import { GetImageLikesUseCase } from "../../../application/usecases/users/get-image-likes-usecase";

export class UserController {
  constructor(
    private readonly findAllUsersImagesUseCase: FindAllUsersImagesUseCase,
    private readonly saveUserImageUseCase: SaveUserImageUseCase,
    private readonly findUserInfosByIdSessionUseCase: FindUserInfosByIdSessionUsecase,
    private readonly updateUserInfosUseCase: UpdateUserInfosUseCase,
    private readonly likeImageUseCase: LikeImageUseCase,
    private readonly getImageLikesUseCase: GetImageLikesUseCase
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

    const users = await this.findAllUsersImagesUseCase.execute(userId);

    resp.end(JSON.stringify(users));
  }

  async findByIdSession({
    req,
    params,
    resp,
  }: ControllerInputType): Promise<void> {
    if (!params?.has(RoutesParamsKey.SESSION_ID)) {
      resp.statusCode = ResponseStatusCode.BAD_REQUEST;
      resp.end();
      return;
    }

    const sessionId = params.get(RoutesParamsKey.SESSION_ID) as string;

    const user = await this.findUserInfosByIdSessionUseCase.execute(sessionId);

    try {
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

    const user = await this.findUserInfosByIdSessionUseCase.execute(
      sessionToken
    );

    if (!user) {
      return null;
    }

    return user.id;
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
      const uploadImageDtoResult = buildSaveImageDtoFromRequestBody(
        JSON.parse(body),
        userId
      );

      if (uploadImageDtoResult.isErr) {
        const error = uploadImageDtoResult.error;

        resp.statusCode = ResponseStatusCode.BAD_REQUEST;
        resp.end(error);
        return;
      }

      const imageDto = uploadImageDtoResult.data;

      try {
        const path = join(process.cwd(), UPLOAD_DEST, imageDto.name);
        await writeFile(path, Buffer.from(imageDto.image, "base64"));
        await this.saveUserImageUseCase.execute(imageDto);
        resp.statusCode = ResponseStatusCode.CREATED_OK;
        resp.end("file uploaded successfully.");
      } catch (error) {
        console.log(error);
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
    const userId = await this.getUserIdFromRequest(req);

    if (!userId) {
      resp.statusCode = ResponseStatusCode.FORBIDDEN;
      resp.end();
      return;
    }

    const images = await this.findAllUsersImagesUseCase.execute(userId);
    resp.statusCode = ResponseStatusCode.GET_OK;
    resp.end(JSON.stringify(images));
  }

  async getImageByName({
    req,
    params,
    resp,
  }: ControllerInputType): Promise<void> {
    const filename = params?.get(RoutesParamsKey.FILE_NAME);
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
    const type = AcceptedMimeType.get(extractFileExtension(path));

    if (!type) {
      resp.statusCode = ResponseStatusCode.BAD_REQUEST;
      resp.end("Invalid type");
      return;
    }

    resp.writeHead(ResponseStatusCode.GET_OK, {
      "Content-Type": `image/${type}`,
      "Content-Length": statSync(path).size,
      "Access-Control-Allow-Origin": "*",
    });

    fileStream.pipe(resp);
  }

  async updateUserInfos({
    req,
    params,
    resp,
  }: ControllerInputType): Promise<void> {
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
      const updateUserInfosDtoResult = buildUpdateUserInfosFromUpdateRequest(
        JSON.parse(body)
      );

      if (updateUserInfosDtoResult.isErr) {
        resp.statusCode = ResponseStatusCode.BAD_REQUEST;
        resp.end();
        return;
      }
      const UpdateUserDto = updateUserInfosDtoResult.data;
      try {
        await this.updateUserInfosUseCase.execute(userId, UpdateUserDto);
        resp.statusCode = ResponseStatusCode.GET_OK;
        resp.end();
      } catch (error) {
        console.log(error);
        resp.statusCode = ResponseStatusCode.SERVER_INTERNAL_ERROR;
        resp.end();
      }
    });
  }

  async likeUserImages({
    req,
    params,
    resp,
  }: ControllerInputType): Promise<void> {
    const userId = await this.getUserIdFromRequest(req);
    if (!userId) {
      resp.statusCode = ResponseStatusCode.FORBIDDEN;
      resp.end();
      return;
    }
    const imageId = params?.get(RoutesParamsKey.IMAGE_ID) ?? "";

    try {
      const result = await this.likeImageUseCase.execute(userId, imageId);

      if (result.isErr) {
        resp.statusCode = ResponseStatusCode.NOT_FOUND;
        resp.end(result.error);
        return;
      }

      resp.statusCode = ResponseStatusCode.CREATED_OK;
      resp.end();
    } catch (error) {
      resp.statusCode = ResponseStatusCode.SERVER_INTERNAL_ERROR;
      resp.end();
    }
  }

  async findImageLikes({
    req,
    params,
    resp,
  }: ControllerInputType): Promise<void> {
    const userId = await this.getUserIdFromRequest(req);
    if (!userId) {
      resp.statusCode = ResponseStatusCode.FORBIDDEN;
      resp.end();
      return;
    }
    const imageId = params?.get(RoutesParamsKey.IMAGE_ID) ?? "";

    try {
      const imageLikes = await this.getImageLikesUseCase.execute(imageId);
      resp.statusCode = ResponseStatusCode.GET_OK;
      resp.end(JSON.stringify(imageLikes));
    } catch (error) {
      resp.statusCode = ResponseStatusCode.SERVER_INTERNAL_ERROR;
      resp.end();
    }
  }
}
