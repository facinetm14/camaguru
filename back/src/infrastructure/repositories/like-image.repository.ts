import { LikeImageRepositoryInterface } from "../../application/interfaces/repositories/like-image.repository.interface";
import { UserImageLike } from "../../core/entities/user-image-like.entity";
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
    const created_at = new Date();
    const updated_ad = created_at;
    const id = uuid();

    const insertQuery = {
      text: `INSERT INTO image_likes(id, author_id, image_id, created_at, updated_at) VALUES($1, $2, $3, $4, $5);`,
      values: [id, authorId, imageId, created_at, updated_ad],
    };

    try {
      const connexion = await pgClient.connect();
      await pgClient.query(insertQuery);
      connexion.release();
      return Ok({
        id,
        authorId,
        imageId,
        createdAt: created_at,
        updatedAt: created_at,
      });
    } catch (error) {
      console.log(error);
      return Err(LikeImageError.UNKNOWN_ERROR);
    }
  }

  async findAllByIdMage(imageId: string): Promise<UserImageLike[]> {
    const selectQuery = {
      text: `SELECT * FROM image_likes WHERE image_id = $1;`,
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
      text: `SELECT * FROM image_likes WHERE image_id = $1 AND author_id = $2 LIMIT 1;`,
      values: [imageId, authorId],
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
      text: `DELETE FROM image_likes WHERE id = $1;`,
      values: [id],
    };

    const connexion = await pgClient.connect();
    await pgClient.query(deleteQuery);
    connexion.release();
  }
}
