import { UserImageLike } from "./user-image-like.entity";

export interface UserImageHeavy {
  id: string;
  name: string;
  author: {
    id: string;
    name: string;
  };
  likeList: UserImageLike[];
  createdAt: Date;
  updatedAt: Date;
}
