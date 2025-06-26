import { LikeImageRepositoryInterface } from "../../application/interfaces/repositories/like-image.repository.interface";
import { UserImageLike } from "../../core/entities/user-image-like.entity";
import { ImageInteractionType } from "../../core/enum/user.enum";
import { LikeImageError } from "../../core/error/like-image.error";
import { pgClient } from "../../database/dataSource";
import { buildImageLikesEntityFromModel } from "../../interface-adapters/web/mappers/user-image.mapper";
import { Err, Ok, Result } from "../../shared/result";
import { uuid } from "../../shared/uuid";

export class LikeImageRepository implements LikeImageRepositoryInterface {
  async create(
    authorId: string,
    imageId: string
  ): Promise<Result<UserImageLike, LikeImageError.UNKNOWN_ERROR>> {
    const createdAt = new Date();
    const updatedAt = createdAt;
    const id = uuid();

    const insertQuery = {
      text: `INSERT INTO image_interactions(id, author_id, image_id, created_at, updated_at, type) VALUES($1, $2, $3, $4, $5, $6);`,
      values: [
        id,
        authorId,
        imageId,
        createdAt,
        updatedAt,
        ImageInteractionType.LIKE,
      ],
    };

    try {
      const connexion = await pgClient.connect();
      await pgClient.query(insertQuery);
      connexion.release();
      return Ok({
        id,
        authorId,
        imageId,
        createdAt,
        updatedAt,
      });
    } catch (error) {
      console.log(error);
      return Err(LikeImageError.UNKNOWN_ERROR);
    }
  }

  async findAllByIdMage(imageId: string): Promise<UserImageLike[]> {
    const selectQuery = {
      text: `SELECT * FROM image_interactions WHERE image_id = $1;`,
      values: [imageId],
    };

    const connexion = await pgClient.connect();
    const result = await pgClient.query(selectQuery);
    connexion.release();

    const imageLikeRawList = result.rows;
    if (!imageLikeRawList.length) {
      return [];
    }

    return imageLikeRawList.map((imageLikeRaw) =>
      buildImageLikesEntityFromModel(imageLikeRaw)
    );
  }

  async findAllByIdMageAndAuthorId(
    imageId: string,
    authorId: string
  ): Promise<UserImageLike | null> {
    const selectQuery = {
      text: `SELECT * FROM image_interactions WHERE image_id = $1 AND author_id = $2 AND type = $3 LIMIT 1;`,
      values: [imageId, authorId, ImageInteractionType.LIKE],
    };

    const connexion = await pgClient.connect();
    const result = await pgClient.query(selectQuery);
    connexion.release();

    const imageLikeRaw = result.rows[0];
    if (!imageLikeRaw) {
      return null;
    }

    return buildImageLikesEntityFromModel(imageLikeRaw);
  }

  async delete(id: string): Promise<void> {
    const deleteQuery = {
      text: `DELETE FROM image_interactions WHERE id = $1;`,
      values: [id],
    };

    const connexion = await pgClient.connect();
    await pgClient.query(deleteQuery);
    connexion.release();
  }
}
