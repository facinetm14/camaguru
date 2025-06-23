import { UserImage } from "../../../core/entities/user-image.entity";
import { SaveImageDto } from "../../dto/save-user-image.dto";

export interface UserImagesRepositoryInteface {
  saveImage(userImage: SaveImageDto): Promise<void>;
  findAll(): Promise<UserImage[]>;
}
