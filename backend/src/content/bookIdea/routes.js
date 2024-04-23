import { allIdeas, addIdea, getIdeaById, deleteIdea } from "./idea.js";
import { allBooks, getBook, updateBook, addBooks } from "./book.js";

export default async function bookIdeaRoutes(fastify, options) {
  fastify.get("/", async (request, reply) => {
    return { message: "This is coming from bookIdea routes" };
  });

  // Routes for ideas
  fastify.get("/idea", async (request, reply) => {
    const userId = request.userId;
    const ideas = await allIdeas(options.db, userId);
    return ideas;
  });

  fastify.post("/idea", async (request, reply) => {
    const userId = request.userId;
    const { idea } = request.body;
    const result = await addIdea(options.db, userId, idea);
    return result;
  });

  fastify.get("/idea/:ideaId", async (request, reply) => {
    const ideaId = request.params.ideaId;
    const idea = await getIdeaById(options.db, ideaId);
    return idea;
  });

  fastify.delete("/idea/:ideaId", async (request, reply) => {
    const userId = request.userId;
    const ideaId = request.params.ideaId;
    const result = await deleteIdea(options.db, userId, ideaId);
    return result;
  });

  // Routes for books

  fastify.get("/book", async (request, reply) => {
    const userId = request.userId;
    const books = await allBooks(options.db, userId);
    return books;
  });

  fastify.get("/book/:bookId", async (request, reply) => {
    const bookId = request.params.bookId;
    const book = await getBook(options.db, bookId);
    return book;
  });

  fastify.post("/book", async (request, reply) => {
    const userId = request.userId;
    const { books } = request.body;
    const result = await addBooks(options.db, userId, books);
    return result;
  });

  fastify.put("/book", async (request, reply) => {
    const { bookId, book } = request.body;
    const result = await updateBook(options.db, bookId, book);
    return result;
  });

  // Add more routes here
}
