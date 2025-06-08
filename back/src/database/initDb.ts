import { buildSchema } from "./dbSchema";

export const initDb = async () => {
  await buildSchema();
};
