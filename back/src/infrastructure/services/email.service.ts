import sgMail from "@sendgrid/mail";
import {
  Email,
  EmailServiceInterface,
} from "../../application/interfaces/services/email.service.interface";
import { ActionStatus } from "../../core/enum/action-status";

export class EmailService implements EmailServiceInterface {
  async send(email: Email): Promise<ActionStatus> {
    sgMail.setApiKey(process.env.SEND_GRID_MAIL_API_KEY!);

    const msg = {
      to: email.to,
      from: process.env.SEND_GRID_MAIL_SENDER!,
      subject: email.subject,
      html: email.msg,
    };

    try {
      const status = await sgMail.send(msg);
      if (status) {
        return ActionStatus.SUCCESS;
      }
    } catch (error) {
      console.log("Error while sending email", { error });
    }
    return ActionStatus.FAILED;
  }
}
