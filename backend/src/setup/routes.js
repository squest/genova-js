import userRoutes from "../user/routes.js";
import cors from "@fastify/cors";

async function mainRoutes(fastify, options) {
  // CORS Setting
  fastify.register(cors, {
    origin: "*",
    methods: ["POST"],
  });

  // Register user routes
  fastify.register(userRoutes, {
    prefix: "/user",
    db: options.db,
  });
}

export default mainRoutes;
