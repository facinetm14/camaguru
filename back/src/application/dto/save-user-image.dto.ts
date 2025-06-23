type Base64 = string;

export interface SaveImageDto {
  id: string;
  name: string;
  image: Base64;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
