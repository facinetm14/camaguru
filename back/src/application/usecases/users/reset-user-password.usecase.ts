import { ActionStatus } from "../../../core/enum/action-status";
import { UserStatus, UserUniqKeys } from "../../../core/enum/user.enum";
import { CLIENT_HOST } from "../../../core/consts/client-host";
import { uuid } from "../../../shared/uuid";
import { UserRepositoryInteface } from "../../ports/repositories/user.repository.interface";
import { resetPasswordLinkTemplate } from "../../../template/email";
import {
  Email,
  EmailServiceInterface,
} from "../../ports/services/email.service.interface";
import { EmailSubject } from "../../../core/enum/email-subject";

export class ResetUserPasswordUseCase {
  constructor(
    private readonly userRepo: UserRepositoryInteface,
    private readonly emailService: EmailServiceInterface
  ) {}

  async execute(email: string): Promise<ActionStatus> {
    const user = await this.userRepo.findUserByUniqKey(
      UserUniqKeys.EMAIL,
      email
    );

    if (!user) {
      return ActionStatus.FAILED;
    }

    const validationToken = uuid();
    const updatedUser = await this.userRepo.update(user.id, {
      validationToken,
      status: UserStatus.CHANGING_PASSWORD,
    });

    if (updatedUser !== ActionStatus.SUCCESS) {
      return ActionStatus.FAILED;
    }

    const createNewPasswordLink = `${CLIENT_HOST}/create-new-password/${validationToken}`;
    const confirmation = resetPasswordLinkTemplate(createNewPasswordLink);

    const emailToSend: Email = {
      to: email,
      msg: confirmation,
      subject: EmailSubject.RESET_PASSWORD,
    };

    return this.emailService.send(emailToSend);
  }
}
