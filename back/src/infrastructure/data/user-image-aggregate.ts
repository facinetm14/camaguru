import { ImageInteractionType } from "../../core/enum/user.enum";

export interface UserImageAggreate {
  id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
  image_author_id: string;
  image_author_name: string;
  interaction_type: ImageInteractionType;
  interaction_content: string | null;
  interaction_id: string | null;
  interaction_author_id: string | null;
  interaction_author_name: string | null;
  interaction_created_at: Date | null;
  interaction_updated_at: Date | null;
}
