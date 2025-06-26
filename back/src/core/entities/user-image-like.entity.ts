import { ImageInteractionType } from "../enum/user.enum";

export type UserImageLike = {
  id: string;
  imageId: string;
  authorId: string;
  authorName?: string;
  createdAt: Date;
  updatedAt: Date;
}
