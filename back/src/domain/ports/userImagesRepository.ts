import { UserImagesModel } from "../../infrastructure/model/UserImagesModel";

export interface UserImagesRepository {
  saveImage(userImage: UserImagesModel): Promise<void>;
  findAll(): Promise<UserImagesModel[]>;
}