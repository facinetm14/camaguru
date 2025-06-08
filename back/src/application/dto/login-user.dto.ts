import { CreateUserDto } from "./create-user.dto";

export type LoginUserDto = Pick<CreateUserDto, "username" | "passwd">;
