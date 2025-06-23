import { User } from "../../core/entities/user.entity";
import { UserStatus } from "../../core/enum/user.enum";

export const isUserVerified = (user: User) => {
  return user.status !== UserStatus.UNVERIFIED;
};

export const canChangePassword = (user: User) => {
  return user.status === UserStatus.CHANGING_PASSWORD && !user.validationToken;
};
