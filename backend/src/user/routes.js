import { addAuthorStyle, getAuthorStyle, updateAuthorStyle } from "./author.js";
import {
  allUsers,
  addUser,
  userByEmail,
  updateUser,
  silentLogin,
  ssoLogin,
} from "./user.js";

export default async function userRoutes(fastify, options) {
  fastify.get("/", async (request, reply) => {
    return { message: "This is coming from user routes" };
  });

  // Routes for user management
  fastify.get("/all", async (request, reply) => {
    const users = await allUsers(options.db);
    return users;
  });

  fastify.post("/byEmail", async (request, reply) => {
    const email = request.body.email;
    const user = await userByEmail(options.db, email);
    return user;
  });

  fastify.post("/add", async (request, reply) => {
    const user = request.body.user;
    const result = await addUser(options.db, user);
    return result;
  });

  fastify.put("/update", async (request, reply) => {
    const { email, user } = request.body;
    const result = await updateUser(options.db, email, user);
    return result;
  });

  fastify.post("/silentLogin", async (request, reply) => {
    const { email, token } = request.body;
    const result = await silentLogin(options.db, { email, token });
    return result;
  });

  fastify.post("/ssoLogin", async (request, reply) => {
    const { email } = request.body;
    const result = await ssoLogin(options.db, { email });
    return result;
  });

  // Routes for author style guide
  fastify.post("/author/style/add", async (request, reply) => {
    const { userId, styleGuide } = request.body;
    const result = await addAuthorStyle(options.db, userId, styleGuide);
    return result;
  });

  fastify.get("/author/style/get", async (request, reply) => {
    const userId = request.userId;
    const styleGuide = await getAuthorStyle(options.db, userId);
    return styleGuide;
  });

  fastify.post("/author/style/update", async (request, reply) => {
    const { userId, styleGuide } = request.body;
    const result = await updateAuthorStyle(options.db, userId, styleGuide);
    return result;
  });

  // Add more routes here
}
