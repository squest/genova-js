import fastify from "fastify";
import mainRoutes from "./routes.js"; // Import mainRoutes dari routes.js
import getDb from "./database.js"; // Import getDb dari database.js
import getGenerator from "./generator.js"; // Import getGenerator dari generator.js

const app = fastify({ logger: true });

async function buildServer(config) {
  // Get the database connection
  const dbase = await getDb(config);
  if (dbase) {
    const genfn = await getGenerator(config, dbase);
    console.log("Database connected");
    app.register(mainRoutes, {
      db: dbase,
      config: config,
      genfn: genfn,
    });
    return app;
  } else {
    console.error("Database connection failed");
    process.exit(1);
  }
}

async function startServer(config) {
  const server = await buildServer(config);
  try {
    server.listen({ port: config.PORT || 8000, host: "0.0.0.0" });
    console.log(`Server listening on port ${config.PORT || 8000}`);
  } catch (err) {
    console.error("Startup error:", err);
    process.exit(1);
  }
}

export { buildServer, startServer };
