import { IncomingMessage, ServerResponse } from "http";
import { RouterInterface } from "./router-interface";
import { ResponseStatusCode } from "../enum/response-status-code";

export class BaseRouter implements RouterInterface {
  handleRoute(req: IncomingMessage, resp: ServerResponse): Promise<void> {
    if (req.method === "GET") {
      resp.statusCode = ResponseStatusCode.GET_OK;
      resp.setHeader("Content-Type", "text/plain");
      resp.end("OK");
    }
    resp.end();
    return Promise.resolve();
  }
}
