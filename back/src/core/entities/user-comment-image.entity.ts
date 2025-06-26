import { UserImageLike } from "./user-image-like.entity";

export interface UserImageComment extends UserImageLike {
  content: string;
}
