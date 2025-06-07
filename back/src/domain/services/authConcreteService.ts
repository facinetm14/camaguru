import { UserStatus, UserUniqKeys } from "../enums/user.enums";
import { verifyPassword } from "../utils/password";
import { uuid } from "../utils/uuid";
import { User } from "../entity/User";
import { CreateUserDto } from "../dtos/createUserDto";
import { LoginUserDto } from "../dtos/loginUserDto";
import { AuthService, UserVeryficationStatus } from "../usecases/authService";
import { Email, EmailSendStatus, EmailService } from "../usecases/emailService";
import { UserService } from "../usecases/userService";
import {
  confirmationTemplate,
  resetPasswordLinkTemplate,
} from "../../template/email";
import { EmailSubject } from "../../infrastructure/enums/EmailSubject";
import { CLIENT_HOST } from "../../infrastructure/enums/AllowedRoutes";
import { RegistrationError } from "../utils/errors/user-registration.error";
import { Err, Ok, Result, ResultWithOutData } from "../utils/validation/result";
import { UserLoginError } from "../utils/errors/user-login.error";
import { isUserVerified } from "../utils/user-status";
import { buildUpdateUserModelFormDto } from "../utils/mappers/user-entity.mapper";
import { UserVerificationError } from "../utils/errors/user-verificatio.error";
import { ResetPasswordDto } from "../dtos/resetPasswordDtot";

export class AuthConcreteService implements AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly emailService: EmailService
  ) {}

  async register(
    createUserDto: CreateUserDto
  ): Promise<Result<User, RegistrationError>> {
    const validationToken = uuid();
    const newUser = await this.userService.create(
      createUserDto,
      validationToken
    );

    if (!newUser) {
      return Err(RegistrationError.UNKNOWN_ERROR);
    }

    const verifyLink = `${CLIENT_HOST}/activate/${validationToken}`;

    const confirmation = confirmationTemplate(verifyLink);
    const emailToSend: Email = {
      to: newUser.email,
      msg: confirmation,
      subject: EmailSubject.USER_REGISTRATION,
    };

    const sendStatus = await this.emailService.send(emailToSend);

    if (sendStatus === EmailSendStatus.OK) {
      return Ok(newUser);
    }

    return Err(RegistrationError.FAILLED_TO_SEND_CONFIRMATION_LINK);
  }

  async verify(token: string): Promise<Result<string, UserVerificationError>> {
    const userByToken = await this.userService.findUserByUniqKey(
      UserUniqKeys.VALIDATION_TOKEN,
      token
    );

    if (!userByToken) {
      console.log(`Error: Invalid User token`);
      return Err(UserVerificationError.INVALID_TOKEN);
    }

    await this.userService.activateAccount(userByToken.id);
    return Ok(userByToken.id);
  }

  async signin(
    loginUserDto: LoginUserDto
  ): Promise<Result<string, UserLoginError>> {
    const user = await this.userService.findUserByUniqKey(
      UserUniqKeys.USER_NAME,
      loginUserDto.username
    );

    if (!user) {
      return Err(UserLoginError.USER_NOT_FOUND);
    }

    if (!isUserVerified(user)) {
      return Err(UserLoginError.USER_EMAIL_NOT_VERIFIED);
    }

    const checkPassword = await verifyPassword(
      loginUserDto.passwd,
      user.passwd,
      user.salt
    );

    if (!checkPassword) {
      return Err(UserLoginError.INVALID_CREDENTIALS);
    }

    return Ok(user.id);
  }

  async resetPassword(email: string): Promise<string | null> {
    const user = await this.userService.findUserByUniqKey(
      UserUniqKeys.EMAIL,
      email
    );

    if (!user) {
      return null;
    }

    const validationToken = uuid();
    const updateUserModel = buildUpdateUserModelFormDto({ validationToken });
    const updatedUser = await this.userService.update(user.id, updateUserModel);
    if (!updatedUser) {
      return null;
    }

    const createNewPasswordLink = `${CLIENT_HOST}/create-new-password/${validationToken}`;
    const confirmation = resetPasswordLinkTemplate(createNewPasswordLink);

    const emailToSend: Email = {
      to: email,
      msg: confirmation,
      subject: EmailSubject.RESET_PASSWORD,
    };

    const status = await this.emailService.send(emailToSend);
    if (status === EmailSendStatus.OK) {
      return user.id;
    }

    return null;
  }

  async createNewPassword(
    newPasswordDto: ResetPasswordDto
  ): Promise<ResultWithOutData> {
    const updatedUser = await this.userService.update(newPasswordDto.id, {
      passwd: newPasswordDto.passwd,
      salt: newPasswordDto.salt,
    });

    if (updatedUser) {
      return Ok(null);
    }

    return Err(null);
  }
}
