import { User } from "../entity/User";
import { UserStatus } from "../enums/user.enums";

export const isUserVerified = (user: User) => {
  return user.status === UserStatus.VERIFIED;
};
