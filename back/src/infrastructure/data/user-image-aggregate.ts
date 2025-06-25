export interface UserImageAggreate {
  id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
  image_author_id: string;
  image_author_name: string;
  like_id: string;
  like_author_id: string;
  like_author_name: string;
  like_created_at: Date;
  like_updated_at: Date;
}
