import { v4 as uuid } from "uuid";
import jwt from "jsonwebtoken";

async function createColl(db) {
  return db.collection("users");
}

export async function allUsers(db) {
  const coll = await createColl(db);
  try {
    const users = await coll.find().toArray();
    return users;
  } catch (e) {
    console.error(e);
  }
}

export async function userByEmail(db, email) {
  const coll = await createColl(db);
  try {
    const user = await coll.findOne({ email });
    return user;
  } catch (e) {
    console.error(e);
  }
}

export async function addUser(db, user) {
  const coll = await createColl(db);
  try {
    const newUser = {
      ...user,
      _id: uuid(),
      token: uuid(),
      approved: false,
      role: "author",
      registeredAt: new Date().toString(),
      lastActive: new Date().toString(),
    };
    const result = await coll.insertOne(newUser);
    return result;
  } catch (e) {
    console.error(e);
  }
}

export async function silentLogin(db, { email, token }) {
  const coll = await createColl(db);
  try {
    const user = await coll.findOne({ email });
    if (user) {
      if (user.token !== token) {
        return {
          status: "error",
          message: "Token invalid cuy",
        };
      } else {
        const tbuUser = await coll.findOneAndUpdate(
          { email },
          {
            $set: {
              lastActive: new Date().toString(),
            },
          },
          {
            returnOriginal: false,
          }
        );
        const jwtToken = jwt.sign(
          { sub: tbuUser._id, role: tbuUser.role },
          process.env.JWT_SECRET_KEY,
          {
            expiresIn: "30d",
          }
        );
        return {
          status: "ok",
          message: "Successfully login",
          token: jwtToken,
        };
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

export async function ssoLogin(db, user) {
  const coll = await createColl(db);
  try {
    const dbUser = await coll.findOne({ email: user.email });
    if (dbUser) {
      if (dbUser.approved) {
        const jwtToken = jwt.sign(
          { sub: dbUser._id, role: dbUser.role },
          process.env.JWT_SECRET_KEY,
          {
            expiresIn: "30d",
          }
        );
        return {
          status: "success",
          message: "User found and authorised",
          user: dbUser,
          token: jwtToken,
        };
      } else {
        return {
          status: "waiting",
          message: "User found but not approved yet",
        };
      }
    } else {
      const tbaUser = await addUser(user);
      return {
        status: "waiting",
        message: "User has been registered, waiting for approval",
        user: tbaUser,
      };
    }
  } catch (e) {
    console.error(e);
  }
}

// This update a user, can be the role or the approved status
export async function updateUser(db, email, user) {
  const coll = await createColl(db);
  try {
    const result = await coll.updateOne(
      { email },
      {
        $set: user,
      }
    );
    return result;
  } catch (e) {
    console.error(e);
  }
}

// Path: src/backend/plumbings/database.js
