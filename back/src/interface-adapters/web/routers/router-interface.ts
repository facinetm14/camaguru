import { IncomingMessage, ServerResponse } from "http";
export interface RouterInterface {
  handleRoute(req: IncomingMessage, resp: ServerResponse): Promise<void>;
}
