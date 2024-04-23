async function createColl(db) {
  return db.collection("users");
}

// a function to add writing guide for an author
// will be used in book generator
export async function addAuthorStyle(db, userId, styleGuide) {
  const coll = await createColl(db);
  try {
    const user = await coll.findOne({ _id: userId });
    if (user) {
      try {
        const result = await coll.updateOne(
          { _id: userId },
          {
            $set: {
              styleGuide,
            },
          }
        );
        if (result) {
          return {
            status: "success",
            message: "Style guide added",
          };
        } else {
          return {
            status: "error",
            message: "Style guide not added",
          };
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      return {
        status: "error",
        message: "User not found",
      };
    }
  } catch (e) {
    console.error(e);
  }
}

export async function getAuthorStyle(db, userId) {
  const coll = await createColl(db);
  try {
    const user = await coll.findOne({ _id: userId });
    if (user) {
      return {
        status: "success",
        styleGuide: user.styleGuide,
      };
    } else {
      return {
        status: "error",
        message: "User not found",
      };
    }
  } catch (e) {
    console.error(e);
  }
}

export async function updateAuthorStyle(db, userId, styleGuide) {
  const coll = await createColl(db);
  try {
    const user = await coll.findOne({ _id: userId });
    if (user) {
      try {
        const result = await coll.updateOne(
          { _id: userId },
          {
            $set: {
              styleGuide,
            },
          }
        );
        if (result) {
          return {
            status: "success",
            message: "Style guide updated",
          };
        } else {
          return {
            status: "error",
            message: "Style guide not updated",
          };
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      return {
        status: "error",
        message: "User not found",
      };
    }
  } catch (e) {
    console.error(e);
  }
}
