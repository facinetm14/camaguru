import { CommentImageDto } from "../../application/dto/comment-image.dto";
import { CommentImageRepositoryInterface } from "../../application/interfaces/repositories/comment-image.repository.interface";
import { ImageInteractionType } from "../../core/enum/user.enum";
import { pgClient } from "../../database/dataSource";
import { uuid } from "../../shared/uuid";

export class CommentImageRepository implements CommentImageRepositoryInterface {
  async create(commentImageDto: CommentImageDto): Promise<void> {
    const createdAt = new Date();
    const updatedAt = createdAt;
    const id = uuid();

    const insertQuery = {
      text: `INSERT INTO image_interactions(id, image_id, author_id, content, created_at, updated_at, type) VALUES($1, $2, $3, $4, $5, $6, $7)`,
      values: [
        id,
        commentImageDto.imageId,
        commentImageDto.authorId,
        commentImageDto.comment,
        createdAt,
        updatedAt,
        ImageInteractionType.COMMENT,
      ],
    };

    const connexion = await pgClient.connect();
    await connexion.query(insertQuery);
    connexion.release();
  }
}
