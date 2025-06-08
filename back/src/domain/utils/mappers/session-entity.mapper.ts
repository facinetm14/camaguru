import { SessionModel } from "../../../infrastructure_old/model/SessionModel";
import { CreateSessionDto } from "../../dtos/createSessionDto";

export const buildSessionModelFromCreateSessionDto = (
  createSessionDto: CreateSessionDto
): SessionModel => {
  return {
    id: createSessionDto.id,
    user_id: createSessionDto.userId,
    created_at: new Date(),
    updated_at: new Date(),
  };
};
