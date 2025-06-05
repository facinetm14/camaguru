import { CreateUserDto } from "../dtos/createUserDto";

export type Email = {
  to: string;
  msg: string;
  subject: string;
};

export enum EmailSendStatus {
  OK = "Ok",
  ERROR = "Error",
}

export interface EmailService {
  send(email: Email): Promise<EmailSendStatus>;
}
