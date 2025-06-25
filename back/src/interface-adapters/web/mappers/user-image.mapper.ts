import { SaveImageDto } from "../../../application/dto/save-user-image.dto";
import { UserImageHeavy } from "../../../core/entities/user-image-heavy.entity";
import { UserImageLike } from "../../../core/entities/user-image-like.entity";
import { UserImage } from "../../../core/entities/user-image.entity";
import { uploadImageError } from "../../../core/error/upload-image.error";
import { UserImageAggreate } from "../../../infrastructure/data/user-image-aggregate";
import { UserImageLikeModel } from "../../../infrastructure/data/user-image-like";
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

export const buildImageLikesEntityFromModel = (
  imageLike: UserImageLikeModel
): UserImageLike => {
  return {
    id: imageLike.id,
    authorId: imageLike.author_id,
    imageId: imageLike.image_id,
    createdAt: imageLike.created_at,
    updatedAt: imageLike.updated_at,
  };
};

export const buildUserImageHeavyFromAggregate = (
  imageAggregateList: UserImageAggreate[]
): UserImageHeavy[] => {
  const imageMap = new Map<string, UserImageHeavy>();
  for (const imageAggregate of imageAggregateList) {
    const like = {
      id: imageAggregate.like_id,
      imageId: imageAggregate.id,
      authorId: imageAggregate.like_author_id,
      authorName: imageAggregate.like_author_name,
      createdAt: imageAggregate.like_created_at,
      updatedAt: imageAggregate.like_updated_at,
    };

    const imageItem = imageMap.get(imageAggregate.id);
    if (!imageItem) {
      const newImageRow: UserImageHeavy = {
        id: imageAggregate.id,
        name: imageAggregate.name,
        author: {
          id: imageAggregate.image_author_id,
          name: imageAggregate.image_author_name,
        },
        likeList: [like],
        createdAt: imageAggregate.created_at,
        updatedAt: imageAggregate.updated_at,
      };

      imageMap.set(imageAggregate.id, newImageRow);
      continue;
    }

    imageItem.likeList.push(like);
  }

  return [...imageMap.values()];
};
