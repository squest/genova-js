import { v4 as uuid } from "uuid";

async function createColl(db) {
  return db.collection("sections");
}

// This gets all sections in a chapter
export async function allSections(db, chapterId) {
  const coll = await createColl(db);
  try {
    const sections = await coll.find({ chapterId }).toArray();
    sections.sort((a, b) => a.order - b.order);
    return {
      status: "success",
      message: "Sections retrieved",
      data: sections,
    };
  } catch (e) {
    console.error(e);
    return {
      status: "error",
      message: "Failed to retrieve sections",
    };
  }
}

// get a section
export async function getSection(db, sectionId) {
  const coll = await createColl(db);
  try {
    const section = await coll.findOne({ _id: sectionId });
    if (section) {
      return {
        status: "success",
        message: "Section retrieved",
        data: section,
      };
    }
    return {
      status: "error",
      message: "Section not found",
    };
  } catch (e) {
    console.error(e);
    return {
      status: "error",
      message: "Failed to retrieve section",
    };
  }
}

// This adds sections to a chapter
export async function addSections(db, chapterId, sections) {
  const coll = await createColl(db);
  try {
    const allSections = await coll
      .find({ chapterId })
      .sort({ order: -1 })
      .limit(1)
      .toArray();
    const lastOrder = allSections.length > 0 ? allSections[0].order : -1;

    const tbaSections = sections.map((section, index) => {
      return {
        _id: uuid(),
        ...section,
        chapterId,
        order: lastOrder + index + 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });
    const result = await coll.insertMany(tbaSections);
    if (result.acknowledged) {
      return {
        status: "success",
        message: "Sections added",
        data: tbaSections,
      };
    } else {
      return {
        status: "error",
        message: "Sections not added",
      };
    }
  } catch (e) {
    console.error(e);
    return {
      status: "error",
      message: "Failed to add sections",
    };
  }
}

// This updates the basic info of a section, either the title or the content only
export async function updateSection(db, sectionId, section) {
  const coll = await createColl(db);
  try {
    const dbSection = await coll.findOne({ _id: sectionId });
    if (dbSection) {
      const tbuSection = { ...dbSection, ...section, updatedAt: new Date() };
      const result = await coll.updateOne(
        { _id: sectionId },
        { $set: tbuSection }
      );
      if (result.acknowledged) {
        return {
          status: "success",
          message: "Section updated",
          data: tbuSection,
        };
      } else {
        return {
          status: "error",
          message: "Section not updated",
        };
      }
    } else {
      return {
        status: "error",
        message: "Section not found",
      };
    }
  } catch (e) {
    console.error(e);
    return {
      status: "error",
      message: "Failed to update section",
    };
  }
}

// Given a list of sectionIds, this updates the order of the sections
export async function reorderingSections(db, chapterId, sectionIds) {
  const coll = await createColl(db);
  try {
    for (let i = 0; i < sectionIds.length; i++) {
      await coll.updateOne(
        { _id: sectionIds[i] },
        {
          $set: {
            order: i,
          },
        }
      );
    }
    const sections = await coll.find({ chapterId }).toArray();
    sections.sort((a, b) => a.order - b.order);
    return {
      status: "success",
      message: "Sections reordered",
      data: sections,
    };
  } catch (e) {
    console.error(e);
    return {
      status: "error",
      message: "Failed to reorder sections",
    };
  }
}

// This deletes a section
async function deleteSection(db, sectionId) {
  const coll = await createColl(db);
  try {
    const result = await coll.deleteOne({ _id: sectionId });
    if (result.acknowledged) {
      return {
        status: "success",
        message: "Section deleted",
      };
    } else {
      return {
        status: "error",
        message: "Section not deleted",
      };
    }
  } catch (e) {
    console.error(e);
    return {
      status: "error",
      message: "Failed to delete section",
    };
  }
}

// This deletes all sections in a chapter
export async function deleteSections(db, chapterId) {
  const coll = await createColl(db);
  try {
    const result = await coll.deleteMany({ chapterId });
    if (result.acknowledged) {
      return {
        status: "success",
        message: "Sections deleted",
      };
    } else {
      return {
        status: "error",
        message: "Sections not deleted",
      };
    }
  } catch (e) {
    console.error(e);
    return {
      status: "error",
      message: "Failed to delete sections",
    };
  }
}

// Add content to the section collection
// No need to add new collection for content
export async function addSectionContent(db, sectionId, content) {
  const coll = await createColl(db);
  const section = await coll.findOne({ _id: sectionId });
  if (section) {
    section.content = content;
    section.updatedAt = new Date();
    const result = await coll.updateOne(
      { _id: sectionId },
      {
        $set: {
          content,
          updatedAt: new Date(),
        },
      }
    );
    if (result.acknowledged) {
      return {
        status: "success",
        message: "Section content added",
        data: section,
      };
    } else {
      return {
        status: "error",
        message: "Failed to add section content",
      };
    }
  } else {
    return {
      status: "error",
      message: "Section not found",
    };
  }
}
