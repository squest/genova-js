import { v4 as uuid } from "uuid";

async function createColl(db) {
  return db.collection("ideas");
}

// an Idea is an idea for certain topic of books
// it consists of the idea & description, and a list of book ideas

export async function allIdeas(db, userId) {
  const coll = await createColl(db);
  try {
    const ideas = await coll.find({ userId }).toArray();
    return { status: "success", data: ideas };
  } catch (e) {
    console.error(e);
    return { status: "error", data: null };
  }
}

export async function getIdeaById(db, ideaId) {
  const coll = await createColl(db);
  try {
    const idea = await coll.findOne({ _id: ideaId });
    return { status: "success", data: idea };
  } catch (e) {
    console.error(e);
    return { status: "error", data: null };
  }
}

export async function addIdea(db, userId, idea) {
  const coll = await createColl(db);
  try {
    const bookIdeas = idea.bookIdeas ? idea.bookIdeas : [];
    const result = await coll.insertOne({
      ...idea,
      userId: userId,
      bookIdeas: bookIdeas,
      _id: uuid(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    if (result.acknowledged) {
      return { status: "success", data: { _id: result.insertedId, ...idea } };
    } else {
      return { status: "error", data: null };
    }
  } catch (e) {
    console.error(e);
    return { status: "error", data: null };
  }
}

// This deletes the idea and all of its book ideas
export async function deleteIdea(db, userId, ideaId) {
  const coll = db.collection("ideas");
  try {
    const idea = await coll.findOne({ _id: ideaId, userId: userId });
    if (!idea) {
      return {
        status: "error",
        data: null,
        message: "Idea not found or user not authorized",
      };
    } else {
      const result = await coll.deleteOne({ _id: ideaId });
      if (result) {
        return {
          status: "success",
          data: null,
          message: "Idea successfully deleted",
        };
      }
    }
  } catch (e) {
    console.error(e);
    return { status: "error", data: null, message: "An error occurred" };
  }
}
