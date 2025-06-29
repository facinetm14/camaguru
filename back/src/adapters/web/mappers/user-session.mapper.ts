import { CreateUserSessionDto } from "../../../application/dto/create-user-session.dto";
import { UserSession } from "../../../core/entities/user-session.entity";
import { UserSessionModel } from "../../../infrastructure/model/user-session.model";

export const buildCreateUserSessionModelFromDto = (
  createSessionDto: CreateUserSessionDto
): UserSessionModel => {
  return {
    id: createSessionDto.id,
    user_id: createSessionDto.userId,
    created_at: new Date(),
    updated_at: new Date(),
  };
};

export const buildUserSessionEntityFromModel = (
  userSessionModel: UserSessionModel
): UserSession => {
  return {
    id: userSessionModel.id,
    userId: userSessionModel.user_id,
    createdAt: userSessionModel.created_at,
    updatedAt: userSessionModel.updated_at,
  };
};
