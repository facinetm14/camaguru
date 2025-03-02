import { User } from "../entity/User";
import { CreateUserDto } from "../dtos/createUserDto";
import { LoginUserDto } from "../dtos/loginUserDto";

export interface AuthService {
  register(createUserDto: CreateUserDto): Promise<User | undefined>;
  verify(token: string): Promise<void>;
  signin(loginUserDto: LoginUserDto): Promise<string | null>;
  resetPassword(email: string): Promise<string | null>;
}
