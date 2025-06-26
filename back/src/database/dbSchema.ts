import { dbConnect } from "./dataSource";
import { createImageCommentTable } from "./migrations/create-image-comments-table";
import { createImageInteractionsTable } from "./migrations/create-image-likes-table";
import { createSessionTable } from "./migrations/create-sessions-table";
import { createUserImagesTable } from "./migrations/create-user-images-table";
import { createUserTable } from "./migrations/create-user-table";

export const buildSchema = async () => {
  const connexion = await dbConnect();
  await Promise.all([
    createUserTable(),
    createSessionTable(),
    createUserImagesTable(),
    //createImageCommentTable(),
    createImageInteractionsTable(),
  ]);
  connexion.release();
};
