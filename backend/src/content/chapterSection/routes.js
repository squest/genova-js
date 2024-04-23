import {
  addChapters,
  getChapter,
  allChapters,
  deleteChapters,
  updateChapter,
  reorderingChapters,
} from "./chapter.js";
import {
  allSections,
  addSections,
  getSection,
  updateSection,
  deleteSections,
  reorderingSections,
  addSectionContent,
} from "./section.js";

export default async function chapterSectionRoutes(fastify, options) {
  fastify.get("/", async (request, reply) => {
    return { message: "This is coming from chapterSection routes" };
  });
  // add more routes here based on chapter.js with prefix /chapter
  // please read chapter.js for more what we need from the request body

  // Routes for chapter management
  fastify.get("/chapters/:bookId", async (request, reply) => {
    const bookId = request.params.bookId;
    const chapters = await allChapters(options.db, bookId);
    return chapters;
  });

  fastify.get("/chapter/:chapterId", async (request, reply) => {
    const chapterId = request.params.chapterId;
    const chapter = await getChapter(options.db, chapterId);
    return chapter;
  });

  fastify.post("/chapters/:bookId", async (request, reply) => {
    const bookId = request.params.bookId;
    const { chapters } = request.body;
    const result = await addChapters(options.db, bookId, chapters);
    return result;
  });

  fastify.put("/chapter/:chapterId", async (request, reply) => {
    const chapterId = request.params.chapterId;
    const { chapter } = request.body;
    const result = await updateChapter(options.db, chapterId, chapter);
    return result;
  });

  fastify.delete("/chapters/:bookId", async (request, reply) => {
    const bookId = request.params.bookId;
    const result = await deleteChapters(options.db, bookId);
    return result;
  });

  fastify.put("/chapters/:bookId/reorder", async (request, reply) => {
    const bookId = request.params.bookId;
    const { chapters } = request.body;
    const result = await reorderingChapters(options.db, bookId, chapters);
    return result;
  });

  // Routes for section management
  fastify.get("/sections/:chapterId", async (request, reply) => {
    const chapterId = request.params.chapterId;
    const sections = await allSections(options.db, chapterId);
    return sections;
  });

  fastify.post("/sections/:chapterId", async (request, reply) => {
    const chapterId = request.params.chapterId;
    const { sections } = request.body;
    const result = await addSections(options.db, chapterId, sections);
    return result;
  });

  fastify.get("/section/:sectionId", async (request, reply) => {
    const sectionId = request.params.sectionId;
    const section = await getSection(options.db, sectionId);
    return section;
  });

  fastify.put("/section/:sectionId", async (request, reply) => {
    const sectionId = request.params.sectionId;
    const { section } = request.body;
    const result = await updateSection(options.db, sectionId, section);
    return result;
  });

  fastify.delete("/sections/:chapterId", async (request, reply) => {
    const chapterId = request.params.chapterId;
    const result = await deleteSections(options.db, chapterId);
    return result;
  });

  fastify.put("/sections/:chapterId/reorder", async (request, reply) => {
    const chapterId = request.params.chapterId;
    const { sections } = request.body;
    const result = await reorderingSections(options.db, chapterId, sections);
    return result;
  });

  fastify.post("/section/:sectionId/content", async (request, reply) => {
    const sectionId = request.params.sectionId;
    const { content } = request.body;
    const result = await addSectionContent(options.db, sectionId, content);
    return result;
  });
}
