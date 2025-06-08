import { IRouter } from "./IRouter";
import { RouterStrategy } from "./routerStrategy";

export type Router = (IRouter & RouterStrategy) | IRouter;
