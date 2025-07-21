import {
  Email,
  EmailServiceInterface,
} from "../../ports/services/email.service.interface";
import { UserRepositoryInteface } from "../../ports/repositories/user.repository.interface";
import { CreateUserDto } from "../../dto/create-user.dto";
import { EmailSubject } from "../../../core/enum/email-subject";
import { RegistrationError } from "../../../core/error/user-registration.error";
import { CLIENT_HOST } from "../../../core/consts/client-host";
import { Result, Err, Ok } from "../../../shared/result";
import { confirmationTemplate } from "../../../template/email";
import { ActionStatus } from "../../../core/enum/action-status";
import { UserUniqKeys } from "../../../core/enum/user.enum";

export class RegisterUserUseCase {
  constructor(
    private readonly userRepo: UserRepositoryInteface,
    private readonly emailService: EmailServiceInterface
  ) {}

  async execute(
    createUserDto: CreateUserDto
  ): Promise<Result<string, RegistrationError>> {
    const userByEmail = await this.userRepo.findUserByUniqKey(
      UserUniqKeys.EMAIL,
      createUserDto.email
    );
    if (userByEmail) {
      return Err(RegistrationError.EMAIL_ALREADY_EXISTS);
    }

    const userByUsername = await this.userRepo.findUserByUniqKey(
      UserUniqKeys.USER_NAME,
      createUserDto.username
    );
    if (userByUsername) {
      return Err(RegistrationError.USER_NAME_ALREADY_EXISTS);
    }

    const createUserResult = await this.userRepo.create(createUserDto);

    if (createUserResult.isErr) {
      return Err(RegistrationError.UNKNOWN_ERROR);
    }

    const verifyLink = `${CLIENT_HOST}/activate/${createUserDto.validationToken}`;
    
    const confirmation = confirmationTemplate(verifyLink);

    const emailToSend: Email = {
      to: createUserDto.email,
      msg: confirmation,
      subject: EmailSubject.USER_REGISTRATION,
    };

    const sendStatus = await this.emailService.send(emailToSend);

    if (sendStatus === ActionStatus.SUCCESS) {
      return Ok(createUserResult.data);
    }

    return Err(RegistrationError.FAILLED_TO_SEND_CONFIRMATION_LINK);
  }
}
