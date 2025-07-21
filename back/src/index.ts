import { createServer, IncomingMessage, ServerResponse } from "http";
import { App } from "./app";
import { initDb } from "./database/initDb";
import { injectDependancies } from "./application/utils/inject-dependancies";

const hostname = process.env.HOST || "0.0.0.0";
const port = process.env.PORT || 5000;

(async () => {
  await initDb();

  const server = createServer((req: IncomingMessage, resp: ServerResponse) => {
    injectDependancies();
    const app = new App(req, resp);
    app.run();
  });

  server.listen(+port, hostname, () => {
    console.info(`Server running at http://${hostname}:${port}/`);
  });
})();
