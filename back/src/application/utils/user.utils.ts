import { User } from "../../core/entities/user.entity";
import { UserStatus } from "../../core/enum/user.enum";

export const isUserVerified = (user: User) => {
  return user.status === UserStatus.VERIFIED;
};
