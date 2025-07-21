import { UserRepositoryInteface } from "../../application/ports/repositories/user.repository.interface";
import { pgClient } from "../../database/dataSource";
import { UserUniqKeys, UserStatus } from "../../core/enum/user.enum";
import { CreateUserDto } from "../../application/dto/create-user.dto";
import {
  buildUserEntityFromModel,
  buildUserModelForUpdateFormDto,
  buildUserModelFromCreateUserDto,
} from "../../adapters/web/mappers/user.mapper";
import { User } from "../../core/entities/user.entity";
import { Err, Ok, Result } from "../../shared/result";
import { RegistrationError } from "../../core/error/user-registration.error";
import { ActionStatus } from "../../core/enum/action-status";
import { UpdateUserDto } from "../../application/dto/update-user.dto";

export class UserRepository implements UserRepositoryInteface {
  async create(
    createUserDto: CreateUserDto
  ): Promise<Result<string, RegistrationError>> {
    const userModel = await buildUserModelFromCreateUserDto(createUserDto);

    const {
      id,
      username,
      first_name,
      last_name,
      email,
      adress,
      passwd,
      created_at,
      updated_at,
      salt,
      status,
      validation_token,
      comment_notification,
    } = userModel;

    const insertQuery = {
      text: `
        INSERT INTO users(id, username, email, adress, passwd, created_at, updated_at, salt, status, validation_token, first_name, last_name, comment_notification)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13);`,
      values: [
        id,
        username,
        email,
        adress,
        passwd,
        created_at,
        updated_at,
        salt,
        status,
        validation_token,
        first_name,
        last_name,
        comment_notification,
      ],
    };

    try {
      const connexion = await pgClient.connect();
      await pgClient.query(insertQuery);
      connexion.release();
      return Ok(id);
    } catch (error) {
      console.log(error);
      return Err(RegistrationError.UNKNOWN_ERROR);
    }
  }

  async findAll(): Promise<User[]> {
    const queryUsers = `SELECT * FROM users;`;

    const connexion = await pgClient.connect();
    const result = await pgClient.query(queryUsers);
    connexion.release();

    const usersRawList = result.rows;

    return usersRawList.map((userRaw) => buildUserEntityFromModel(userRaw));
  }

  async findUserByUniqKey(
    key: UserUniqKeys,
    value: string
  ): Promise<User | null> {
    const queryUser = {
      text: `SELECT * FROM users WHERE ${key} = $1 LIMIT 1`,
      values: [value],
    };

    const connexion = await pgClient.connect();
    const result = await pgClient.query(queryUser);
    connexion.release();
    const user = result.rows[0];
    if (!user) {
      return null;
    }

    return buildUserEntityFromModel(user);
  }

  async findUserListByUniqKey(
    key: UserUniqKeys,
    values: string[]
  ): Promise<User[]> {
    const valuePlaceholders = values
      .map((_, index) => `$${index + 1}`)
      .join(", ");

    const queryUser = {
      text: `SELECT * FROM users WHERE ${key} IN (${valuePlaceholders})`,
      values: values,
    };

    const connexion = await pgClient.connect();
    const result = await pgClient.query(queryUser);
    connexion.release();

    const userRawList = result.rows;

    if (!userRawList.length) {
      return [];
    }

    return userRawList.map((userRaw) => buildUserEntityFromModel(userRaw));
  }

  async updateStatusAndRemoveValidationToken(
    userId: string,
    userStatus: UserStatus
  ): Promise<ActionStatus> {
    const updateQuery = {
      text: `UPDATE users SET status=$1, validation_token=null WHERE id=$2`,
      values: [userStatus, userId],
    };

    let status: ActionStatus;
    const connexion = await pgClient.connect();
    try {
      await pgClient.query(updateQuery);
      status = ActionStatus.SUCCESS;
    } catch (error) {
      console.log("Error: unable to update user", userId);
      status = ActionStatus.FAILED;
    }
    connexion.release();
    return status;
  }

  async update(
    userId: string,
    updateUserDto: UpdateUserDto
  ): Promise<ActionStatus> {
    const updateUser = buildUserModelForUpdateFormDto(updateUserDto);

    let columns = "";
    const columnsValues = [];

    let index = 1;

    for (const [colum, value] of Object.entries(updateUser)) {
      columns += `${index > 1 ? "," : ""} ${colum}=$${index}`;
      columnsValues.push(value);
      index += 1;
    }

    const updateQuery = {
      text: `UPDATE users SET ${columns} WHERE id=$${index}`,
      values: [...columnsValues, userId],
    };

    let status: ActionStatus;
    const connexion = await pgClient.connect();
    try {
      await pgClient.query(updateQuery);
      status = ActionStatus.SUCCESS;
    } catch (error) {
      console.log("Error: unable to update user", userId);
      status = ActionStatus.FAILED;
    }
    connexion.release();

    return status;
  }
}
