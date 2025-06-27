import { CommentNotificationStatus } from "../enum/user.enum";

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  adress: string;
  username: string;
  passwd: string;
  createdAt: Date;
  updatedAt: Date;
  status: string;
  validationToken?: string;
  salt?: string;
  commentNotification: CommentNotificationStatus;
};
