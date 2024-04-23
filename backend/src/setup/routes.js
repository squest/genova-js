// Import other groups of routes as needed
import generatorRoutes from "../generators/routes.js";
import bookIdeaRoutes from "../content/bookIdea/routes.js";
import chapterSectionRoutes from "../content/chapterSection/routes.js";
import userRoutes from "../user/routes.js";
import { authenticateToken } from "../middleware/authenticate.js";
import cors from "@fastify/cors";

async function mainRoutes(fastify, options) {
  // CORS Setting
  fastify.register(cors, {
    origin: "*",
    methods: ["POST"],
  });

  // Default route
  fastify.get("/", async (request, reply) => {
    return { hello: "from Zenbrain api" };
  });
  // Register generator routes
  fastify.register(async function (fastify, opts) {
    fastify.addHook("preHandler", authenticateToken);
    fastify.register(generatorRoutes, {
      prefix: "/generator",
      db: opts.db,
      genfn: opts.genfn,
    });
  }, options);

  // Register bookIdea routes
  fastify.register(async function (fastify, opts) {
    fastify.addHook("preHandler", authenticateToken);
    fastify.register(bookIdeaRoutes, {
      prefix: "/bookIdea",
      db: opts.db,
    });
  }, options);

  // Register chapterSection routes
  // Register chapterSection routes
  fastify.register(async function (fastify, opts) {
    fastify.addHook("preHandler", authenticateToken);
    fastify.register(chapterSectionRoutes, {
      prefix: "/chapterSection",
      db: opts.db,
    });
  }, options);

  // Register user routes
  fastify.register(userRoutes, {
    prefix: "/user",
    db: options.db,
  });
}

export default mainRoutes;
