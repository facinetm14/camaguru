import { Email, EmailSendStatus, EmailService } from "../usecases/emailService";
import sgMail from "@sendgrid/mail";

export class EmailConcreteService implements EmailService {
  async send(email: Email): Promise<EmailSendStatus> {
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
        return EmailSendStatus.OK;
      }
    } catch (error) {
      console.log("Error while sending email", { error });
    }
    return EmailSendStatus.ERROR;
  }
}
