import { pgClient } from "../dataSource";
const query = `
        CREATE TABLE IF NOT EXISTS image_likes (
            id VARCHAR(255) UNIQUE NOT NULL,
            image_id VARCHAR(255) NOT NULL,
            author_id VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        );
    `;

export const createImageLikesTable = async () => {
  return pgClient.query(query);
};
