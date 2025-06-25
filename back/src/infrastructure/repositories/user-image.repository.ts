import { SaveImageDto } from "../../application/dto/save-user-image.dto";
import { UserImagesRepositoryInteface } from "../../application/interfaces/repositories/user-image.repository.inteface";
import { UserImageHeavy } from "../../core/entities/user-image-heavy.entity";
import { UserImage } from "../../core/entities/user-image.entity";
import { pgClient } from "../../database/dataSource";
import {
  buildUploadUserImageEntityFromModel,
  buildUserImageHeavyFromAggregate,
} from "../../interface-adapters/web/mappers/user-image.mapper";

export class UserImageRepository implements UserImagesRepositoryInteface {
  async find(id: string): Promise<UserImage | null> {
    const queryUserImage = {
      text: `SELECT * FROM user_images WHERE id=$1 LIMIT 1;`,
      values: [id],
    };

    const connexion = await pgClient.connect();
    const result = await pgClient.query(queryUserImage);
    connexion.release();

    const imageRaw = result.rows[0];
    if (!imageRaw) {
      return null;
    }

    return buildUploadUserImageEntityFromModel(imageRaw);
  }

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

  async findAllByUser(userId: string): Promise<UserImageHeavy[]> {
    const queryUserImages = {
      text: `
        SELECT 
          ui.id, ui.name, ui.created_at, ui.updated_at, ui.user_id AS image_author_id, 
          u1.username AS image_author_name,l.id AS like_id,l.author_id AS like_author_id,
          u2.username AS like_author_name,
          l.created_at AS like_created_at,
          l.updated_at AS like_updated_at
        FROM
          user_images ui
        INNER JOIN
          image_likes l ON ui.id = l.image_id
        LEFT JOIN
          users u1 ON u1.id = ui.user_id
        LEFT JOIN
          users u2 ON u2.id = l.author_id
        WHERE 
          ui.user_id = $1
        ORDER BY 
          l.created_at DESC;
      `,
      values: [userId],
    };

    const connexion = await pgClient.connect();
    const result = await pgClient.query(queryUserImages);
    connexion.release();

    const imagesRawList = result.rows;
    console.log({ imagesRawList });
    if (!imagesRawList.length) {
      return [];
    }

    return buildUserImageHeavyFromAggregate(imagesRawList);
  }
}
