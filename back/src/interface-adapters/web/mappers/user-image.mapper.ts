import { SaveImageDto } from "../../../application/dto/save-user-image.dto";
import { UserImage } from "../../../core/entities/user-image.entity";
import { uploadImageError } from "../../../core/error/upload-image.error";
import { UserImageModel } from "../../../infrastructure/data/user-image.model";
import { Err, Ok, Result } from "../../../shared/result";
import { isNotEmptyString } from "../../../shared/string";
import { uuid } from "../../../shared/uuid";

export const buildUploadUserImageEntityFromModel = (
  userImage: UserImageModel
): UserImage => {
  return {
    userId: userImage.user_id,
    id: userImage.id,
    createdAt: userImage.created_at,
    updatedAt: userImage.updated_at,
    name: userImage.name,
  };
};

export const buildSaveImageDtoFromRequestBody = (
  body: any,
  userId: string
): Result<SaveImageDto, uploadImageError> => {
  if (!isNotEmptyString(body.filename)) {
    return Err(uploadImageError.INVALID_FILE_NAME);
  }

  if (!isNotEmptyString(body.image)) {
    return Err(uploadImageError.INVALID_IMAGE);
  }

  return Ok({
    id: uuid(),
    name: body.filename,
    image: body.image,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId,
  });
};
