import { RouterInterface } from "../routers/router-interface";
import { RouterStrategy } from "../routers/routing-strategy";

export type Router = (RouterInterface & RouterStrategy) | RouterInterface;
