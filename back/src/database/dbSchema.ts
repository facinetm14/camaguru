import { dbConnect } from "./dataSource";
import { createImageInteractionsTable } from "./migrations/create-image-interactions-table";
import { createSessionTable } from "./migrations/create-sessions-table";
import { createUserImagesTable } from "./migrations/create-user-images-table";
import { createUserTable } from "./migrations/create-user-table";

export const buildSchema = async () => {
  const connexion = await dbConnect();
  await Promise.all([
    createUserTable(),
    createSessionTable(),
    createUserImagesTable(),
    createImageInteractionsTable(),
  ]);
  connexion.release();
};
