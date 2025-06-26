import { ImageInteractionType } from "../../core/enum/user.enum";

export interface UserImageLikeModel {
  id: string;
  image_id: string;
  author_id: string;
  created_at: Date;
  updated_at: Date;
  type: ImageInteractionType;
  content: string | null;
}
