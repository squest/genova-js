import { deleteSections } from "./section.js";
import { v4 as uuid } from "uuid";

async function createColl(db) {
  return db.collection("chapters");
}

// This gets all chapters in a book
export async function allChapters(db, bookId) {
  const coll = await createColl(db);
  try {
    const chapters = await coll.find({ bookId }).toArray();
    chapters.sort((a, b) => a.order - b.order);
    return {
      status: "success",
      message: "Chapters retrieved",
      data: chapters,
    };
  } catch (e) {
    console.error(e);
    return {
      status: "error",
      message: "Failed to retrieve chapters",
    };
  }
}

// This adds chapters to a book
export async function addChapters(db, bookId, chapters) {
  const coll = await createColl(db);
  try {
    // get all chapters then get the last order
    const allChapters = await coll
      .find()
      .sort({ order: -1 })
      .limit(1)
      .toArray();
    const lastOrder = allChapters.length > 0 ? allChapters[0].order : -1;

    const tbaChapters = chapters.map((chapter, index) => {
      return {
        ...chapter,
        bookId,
        _id: uuid(),
        order: lastOrder + index + 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });
    const result = await coll.insertMany(tbaChapters);
    if (result.acknowledged) {
      const insertedChapters = tbaChapters.map((chapter, index) => {
        return {
          _id: result.insertedIds[index],
          ...chapter,
        };
      });
      return {
        status: "success",
        message: "Chapters added",
        data: insertedChapters,
      };
    }
    return {
      status: "error",
      message: "Chapters not added",
    };
  } catch (e) {
    console.error(e);
  }
}

export async function getChapter(db, chapterId) {
  const coll = await createColl(db);
  try {
    const chapter = await coll.findOne({ _id: chapterId });
    if (chapter) {
      return {
        status: "success",
        message: "Chapter retrieved",
        data: chapter,
      };
    }
    return {
      status: "error",
      message: "Chapter not found",
    };
  } catch (e) {
    console.error(e);
    return {
      status: "error",
      message: "Failed to retrieve chapter",
    };
  }
}

// This updates the basic info of a chapter, either the title or the description only
export async function updateChapter(db, chapterId, chapter) {
  const coll = await createColl(db);
  try {
    const dbChapter = await coll.findOne({ _id: chapterId });
    if (dbChapter) {
      const tbuChapter = { ...dbChapter, ...chapter, updatedAt: new Date() };
      const result = await coll.updateOne(
        { _id: chapterId },
        { $set: tbuChapter }
      );
      if (result.matchedCount > 0) {
        const updatedChapter = await coll.findOne({ _id: chapterId });
        return {
          status: "success",
          message: "Chapter updated",
          data: updatedChapter,
        };
      } else {
        return {
          status: "error",
          message: "Chapter not updated",
        };
      }
    }
  } catch (e) {
    console.error(e);
  }
}

// This deletes the chapter and all of its sections
async function deleteChapter(db, chapterId) {
  const coll = await createColl(db);
  try {
    const chapter = await coll.findOne({ _id: chapterId });
    if (!chapter) {
      return {
        status: "error",
        message: "Chapter not found",
      };
    } else {
      const result = await coll.deleteOne({ _id: chapterId });
      if (result) {
        const sections = await deleteSections(chapterId);
        return {
          status: "success",
          message: "Chapter deleted",
        };
      } else {
        return {
          status: "error",
          message: "Chapter not deleted",
        };
      }
    }
  } catch (e) {
    console.error(e);
  }
}

// This deletes all chapters in a book
export async function deleteChapters(db, bookId) {
  const coll = await createColl(db);
  try {
    const chapters = await coll.find({ bookId }).toArray();
    for (let i = 0; i < chapters.length; i++) {
      const result = await deleteChapter(chapters[i]._id);
      if (!result) {
        return {
          status: "error",
          message: "Chapters not deleted",
        };
      }
    }
    return {
      status: "success",
      message: "Chapters deleted",
    };
  } catch (e) {
    console.error(e);
  }
}

// Given a list of chapterIds, this function will update the order of the chapters
export async function reorderingChapters(db, bookId, chapterIds) {
  const coll = await createColl(db);
  try {
    for (let i = 0; i < chapterIds.length; i++) {
      const result = await coll.updateOne(
        { _id: chapterIds[i] },
        {
          $set: {
            order: i,
          },
        }
      );
    }
    const chapters = await coll.find({ bookId }).toArray();
    chapters.sort((a, b) => a.order - b.order);
    return {
      status: "success",
      message: "Chapters reordered",
      data: chapters,
    };
  } catch (e) {
    console.error(e);
  }
}
