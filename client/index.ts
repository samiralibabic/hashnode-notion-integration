const BASE_PATH = "./public";

const server = Bun.serve({
  port: 3001,
  async fetch(req) {
    const requestUrl = new URL(req.url).pathname;

    // serve landing page with "Add to Notion" button
    if (requestUrl === "/") {
      return new Response(Bun.file("./src/index.html"), {
        headers: {
          "Content-Type": "text/html",
        }
      });
    }

    // serve form
    if (requestUrl === "/form") {
      return new Response(Bun.file("./src/form/index.html"), {
        headers: {
          "Content-Type": "text/html",
        },
      });
    }

    // Other requests are served from public folder
    const filePath = BASE_PATH + new URL(req.url).pathname;
    const file = Bun.file(filePath);
    return new Response(file);
  },
  error() {
    return new Response(null, { status: 404 });
  },
});

console.log(`Listening on ${server.url}`);
