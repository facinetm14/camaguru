import { CreateUserDto } from "./create-user.dto";

export type UpdateUserDto = Omit<Partial<CreateUserDto>, "id">;
