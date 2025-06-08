import {
  Email,
  EmailServiceInterface,
} from "../../interfaces/services/email.service.interface";
import { UserRepositoryInteface } from "../../interfaces/repositories/user.repository.interface";
import { CreateUserDto } from "../../dto/create-user.dto";
import { EmailSubject } from "../../../core/enum/email-subject";
import { RegistrationError } from "../../../core/error/user-registration.error";
import { CLIENT_HOST } from "../../../core/consts/client-host";
import { Result, Err, Ok } from "../../../shared/result";
import { confirmationTemplate } from "../../../template/email";
import { ActionStatus } from "../../../core/enum/action-status";

export class RegisterUserUseCase {
  constructor(
    private readonly userRepo: UserRepositoryInteface,
    private readonly emailService: EmailServiceInterface
  ) {}

  async execute(
    createUserDto: CreateUserDto
  ): Promise<Result<string, RegistrationError>> {
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
      const newUser = createUserResult.data;
      return Ok(newUser.id);
    }

    return Err(RegistrationError.FAILLED_TO_SEND_CONFIRMATION_LINK);
  }
}
