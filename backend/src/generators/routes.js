// Description: This file contains all the routes for the anov module.
import generateBookIdea from "./bookIdeas.js";
import generateChapters from "./chapters.js";
import generateSections from "./sections.js";
import generateSectionContent from "./sectionContent.js";
import regenerateSectionContent from "./reSectionContent.js";

export default async function generatorRoutes(fastify, options) {
  fastify.get("/", async (request, reply) => {
    return { message: "This is coming from anov routes" };
  });

  const db = options.db;
  const openai = options.genfn;

  fastify.post("/generateBookIdea", async (request, reply) => {
    const userId = request.userId;
    const { title, description, n } = request.body;
    const result = await generateBookIdea(db, openai, {
      userId,
      title,
      description,
      n,
    });
    return result;
  });

  fastify.post("/generateChapters", async (request, reply) => {
    const userId = request.userId;
    const { title, description, bookId, n } = request.body;
    const result = await generateChapters(db, openai, {
      userId,
      title,
      description,
      bookId,
      n,
    });
    return result;
  });

  fastify.post("/generateSections", async (request, reply) => {
    const userId = request.userId;
    const {
      chapterId,
      bookTitle,
      bookDescription,
      chapterTitle,
      chapterDescription,
      n,
    } = request.body;
    const result = await generateSections(db, openai, {
      userId,
      chapterId,
      bookTitle,
      bookDescription,
      chapterTitle,
      chapterDescription,
      n,
    });
    return result;
  });

  fastify.post("/generateSectionContent", async (request, reply) => {
    const userId = request.userId;
    const {
      sectionId,
      bookTitle,
      bookDescription,
      chapterTitle,
      chapterDescription,
      sectionTitle,
      sectionDescription,
    } = request.body;
    const result = await generateSectionContent(db, openai, {
      userId,
      sectionId,
      bookTitle,
      bookDescription,
      chapterTitle,
      chapterDescription,
      sectionTitle,
      sectionDescription,
    });
    return result;
  });

  fastify.post("/regenerateSectionContent", async (request, reply) => {
    const userId = request.userId;
    const {
      sectionId,
      title,
      sectionContent,
      feedback,
    } = request.body;
    const result = await regenerateSectionContent(db, openai, {
      userId,
      sectionId,
      title,
      sectionContent,
      feedback,
    });
    return result;
  });

  // Add more routes here
}
