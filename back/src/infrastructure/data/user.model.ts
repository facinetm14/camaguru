import { UserStatus } from "../../core/enum/user.enum";

export type UserModel = {
  id: string;
  email: string;
  adress: string;
  username: string;
  first_name: string;
  last_name: string;
  passwd: string;
  created_at: Date;
  updated_at: Date;
  salt: string;
  validation_token: string;
  status: UserStatus;
};

export type UserModelForUpdate = Omit<
  Partial<UserModel>,
  "id" | "email" | "status" | "created_at"
>;
