import { UserImageComment } from "./user-comment-image.entity";
import { UserImageLike } from "./user-image-like.entity";

export interface UserImageHeavy {
  id: string;
  name: string;
  author: {
    id: string;
    name: string;
  };
  likeList: UserImageLike[];
  commentList: UserImageComment[];
  createdAt: Date;
  updatedAt: Date;
}
