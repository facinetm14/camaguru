import { text } from "stream/consumers";
import { pgClient } from "../../database/dataSource";
import { UserSessionRepositoryInterface } from "../../application/ports/repositories/user-session.repository.interface";
import { Err, Ok, Result } from "../../shared/result";
import { UserSession } from "../../core/entities/user-session.entity";
import { UserLoginError } from "../../core/error/user-login.error";
import { CreateUserSessionDto } from "../../application/dto/create-user-session.dto";
import {
  buildCreateUserSessionModelFromDto,
  buildUserSessionEntityFromModel,
} from "../../adapters/web/mappers/user-session.mapper";
import { ActionStatus } from "../../core/enum/action-status";

export class USerSessionRepository implements UserSessionRepositoryInterface {
  async create(
    createUserSessionDto: CreateUserSessionDto
  ): Promise<Result<UserSession, UserLoginError>> {
    const sessionModel =
      buildCreateUserSessionModelFromDto(createUserSessionDto);

    const { id, user_id, created_at, updated_at } = sessionModel;

    const insertQuery = {
      text: `
              INSERT INTO users_sessions(id, user_id, created_at, updated_at)
              VALUES($1, $2, $3, $4);
            `,
      values: [id, user_id, created_at, updated_at],
    };

    const connexion = await pgClient.connect();
    try {
      const result = await pgClient.query(insertQuery);
      if (!result.rowCount) {
        return Err(UserLoginError.UNABLE_TO_CREATE_USER_SESSION);
      }
      const session = await this.findById(createUserSessionDto.id);
      connexion.release();
      if (!session) {
        return Err(UserLoginError.USER_NOT_FOUND);
      }

      return Ok(session);
    } catch (error) {
      console.error(error);
      return Err(UserLoginError.UNABLE_TO_CREATE_USER_SESSION);
    }
  }

  async findById(id: string): Promise<UserSession | null> {
    const queryUser = {
      text: `SELECT * FROM users_sessions WHERE id = $1 LIMIT 1`,
      values: [id],
    };

    const connexion = await pgClient.connect();
    const result = await pgClient.query(queryUser);
    connexion.release();
    const sessionRaw = result.rows[0];

    if (!sessionRaw) {
      return null;
    }

    return buildUserSessionEntityFromModel(sessionRaw);
  }

  async delete(id: string): Promise<ActionStatus> {
    const deleteQuery = {
      text: `DELETE FROM users_sessions WHERE id = $1`,
      values: [id],
    };

    try {
      const connexion = await pgClient.connect();
      await pgClient.query(deleteQuery);
      connexion.release();
      return ActionStatus.SUCCESS;
    } catch (error) {
      console.error(error);
      return ActionStatus.FAILED;
    }
  }
}
