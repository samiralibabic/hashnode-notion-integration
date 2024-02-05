import { createDatabase } from "./services/database.js";
import "./util/logger.js";
import { add, notion, verify, hashnode } from "./endpoints.js";

console.log(`Starting ${Bun.env.NODE_ENV} server.`);

Bun.serve({
  async fetch(req) {
    let hashionDb = createDatabase();
    const url = new URL(req.url);
    const path = url.pathname;

    switch (path) {
      case '/add': return add();

      case '/notion': return await notion(req, hashionDb);

      case '/verify': return verify(req, hashionDb);

      case '/hashnode': return hashnode(req, hashionDb);
    }

    return new Response("404!", { status: 404 });
  },
  tls:
    Bun.env.NODE_ENV === "development"
      ? {
        key: Bun.file("./ssl/localhost.key"),
        cert: Bun.file("./ssl/localhost.crt"),
      }
      : undefined,
  error(error) {
    console.error(error.message);

    return Response.error();
  }
});
