import { UserUniqKeys } from "../enums/user.enums";
import { verifyPassword } from "../utils/password";
import { uuid } from "../utils/uuid";
import { User } from "../entity/User";
import { CreateUserDto } from "../dtos/createUserDto";
import { LoginUserDto } from "../dtos/loginUserDto";
import { AuthService } from "../usecases/authService";
import { Email, EmailSendStatus, EmailService } from "../usecases/emailService";
import { UserService } from "../usecases/userService";
import { confirmationTemplate } from "../../template/email";
import { EmailSubject } from "../../infrastructure/enums/EmailSubject";
import { CLIENT_HOST } from "../../infrastructure/enums/AllowedRoutes";

export class AuthConcreteService implements AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly emailService: EmailService
  ) {}

  async register(createUserDto: CreateUserDto): Promise<User | undefined> {
    const validationToken = uuid();
    try {
      const newUser = await this.userService.create(
        createUserDto,
        validationToken
      );

      const verifyLink = `${CLIENT_HOST}/activate/${validationToken}`;

      const confirmation = confirmationTemplate(verifyLink);
      const email: Email = {
        to: newUser.email,
        msg: confirmation,
        subject: EmailSubject.USER_REGISTRATION,
      };

      if (newUser) {
        const sendStatus = await this.emailService.send(email);

        if (sendStatus === EmailSendStatus.OK) {
          return newUser;
        }
      }
    } catch (error) {
      console.log(error);
      throw new Error("Error: user registration process failled");
    }
  }

  async verify(token: string): Promise<void> {
    const userByToken = await this.userService.findUserByUniqKey(
      UserUniqKeys.VALIDATION_TOKEN,
      token
    );
    if (userByToken) {
      return this.userService.activateAccount(userByToken.id);
    }

    throw new Error("Error: Invalid token");
  }

  async signin(loginUserDto: LoginUserDto): Promise<string | null> {
    const user = await this.userService.findUserByUniqKey(
      UserUniqKeys.USER_NAME,
      loginUserDto.username
    );

    if (!user) {
      return null;
    }

    const checkPassword = await verifyPassword(
      loginUserDto.passwd,
      user.passwd,
      user.salt
    );

    if (!checkPassword) {
      return null;
    }

    return user.id;
  }

  async resetPassword(email: string): Promise<string | null> {
    const user = await this.userService.findUserByUniqKey(
      UserUniqKeys.EMAIL,
      email
    );

    if (!user) {
      return null;
    }

    return user.email;
  }
}
