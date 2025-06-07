import { CreateUserDto } from "./createUserDto";

export type UpdateUserDto = Omit<Partial<CreateUserDto>, "id" | "email">;
