import { SaveImageDto } from "../../application/dto/save-user-image.dto";
import { UserImagesRepositoryInteface } from "../../application/interfaces/repositories/user-image.repository.inteface";
import { UserImage } from "../../core/entities/user-image.entity";
import { pgClient } from "../../database/dataSource";
import { buildUploadUserImageEntityFromModel } from "../../interface-adapters/web/mappers/user-image.mapper";

export class UserImageRepository implements UserImagesRepositoryInteface {
  async saveImage(userImageDto: SaveImageDto): Promise<void> {
    const { id, userId, name, createdAt, updatedAt } = userImageDto;

    const insertQuery = {
      text: `
            INSERT INTO user_images(id, user_id, name, created_at, updated_at) VALUES($1, $2, $3, $4, $5);`,
      values: [id, userId, name, createdAt, updatedAt],
    };

    const connexion = await pgClient.connect();
    await pgClient.query(insertQuery);
    connexion.release();
  }
  async findAll(): Promise<UserImage[]> {
    const queryUserImages = `SELECT * FROM user_images;`;

    const connexion = await pgClient.connect();
    const result = await pgClient.query(queryUserImages);
    connexion.release();

    const imagesRawList = result.rows;

    return imagesRawList.map((imageRaw) =>
      buildUploadUserImageEntityFromModel(imageRaw)
    );
  }
}
