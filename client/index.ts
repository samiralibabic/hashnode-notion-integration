const server = Bun.serve({
  async fetch(req: Request) {
    const url = new URL(req.url);
    if (url.pathname === "/form") {
      return new Response(Bun.file("./form/index.html"), {
        headers: {
          "Content-Type": "text/html",
        },
      });
    }

    return new Response("Not found", { status: 404 });
  },
});
console.log(`Listening on http://localhost:${server.port}`);
