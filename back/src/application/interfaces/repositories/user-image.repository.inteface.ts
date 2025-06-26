import { UserImageHeavy } from "../../../core/entities/user-image-heavy.entity";
import { UserImage } from "../../../core/entities/user-image.entity";
import { SaveImageDto } from "../../dto/save-user-image.dto";

export interface UserImagesRepositoryInteface {
  saveImage(userImage: SaveImageDto): Promise<void>;
  findAll(): Promise<UserImageHeavy[]>;
  find(id: string): Promise<UserImage | null>;
}
