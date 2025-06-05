import { UserImagesModel } from "../../../infrastructure/model/UserImagesModel";
import { UserImage } from "../../entity/userImage";
import { uuid } from "../uuid";

export const buildUserImagesModel = (
  userId: string,
  filename: string
): UserImagesModel => {
  return {
    id: uuid(),
    user_id: userId,
    name: filename,
    created_at: new Date(),
    updated_at: new Date(),
  };
};

export const buildUserImageEntityFromModel = (
  userImage: UserImagesModel
): UserImage => {
  return {
    id: userImage.id,
    userId: userImage.user_id,
    name: userImage.name,
    createdAt: userImage.created_at,
    updatedAt: userImage.updated_at,
  };
};
