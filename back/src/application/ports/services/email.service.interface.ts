import { ActionStatus } from "../../../core/enum/action-status";
import { EmailSubject } from "../../../core/enum/email-subject";

export type Email = {
  to: string;
  subject: EmailSubject;
  msg: string;
};

export interface EmailServiceInterface {
  send(email: Email): Promise<ActionStatus>;
}
