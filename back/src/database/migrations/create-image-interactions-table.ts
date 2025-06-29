import { pgClient } from "../dataSource";
const query = `
        CREATE TABLE IF NOT EXISTS image_interactions (
            id VARCHAR(255) UNIQUE NOT NULL,
            type VARCHAR(255) NOT NULL,
            content VARCHAR(255),
            image_id VARCHAR(255) NOT NULL,
            author_id VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        );
    `;

export const createImageInteractionsTable = async () => {
  return pgClient.query(query);
};
