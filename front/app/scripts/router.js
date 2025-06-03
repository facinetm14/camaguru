import { Activate } from "../pages/Activate.js";
import { Confirm } from "../pages/Confirm.js";
import { Home } from "../pages/Home.js";
import { NotFound } from "../pages/NotFound.js";
import { Profile } from "../pages/Profile.js";

export const routes = new Map([
  ["/", Home],
  ["register", Home],
  ["confirm", Confirm],
  ["activate", Activate],
  ["404", NotFound],
  ["profile", Profile]
]);
