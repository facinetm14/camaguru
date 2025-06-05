import { pgClient } from "../../database/dataSource";
import { UserImagesRepository } from "../../domain/ports/userImagesRepository";
import { UserImagesModel } from "../model/UserImagesModel";

export class UserImagesConcreteRepository implements UserImagesRepository {
  async saveImage(userImage: UserImagesModel): Promise<void> {
    const { id, user_id, name, created_at, updated_at } = userImage;

    const insertQuery = {
      text: `
            INSERT INTO user_images(id, user_id, name, created_at, updated_at) VALUES($1, $2, $3, $4, $5);`,
      values: [id, user_id, name, created_at, updated_at],
    };

    const connexion = await pgClient.connect();
    await pgClient.query(insertQuery);
    connexion.release();
  }
  async findAll(): Promise<UserImagesModel[]> {
    const queryUserImages = `SELECT * FROM user_images;`;

    const connexion = await pgClient.connect();
    const result = await pgClient.query(queryUserImages);
    connexion.release();

    const images = result.rows;

    return images;
  }
}
