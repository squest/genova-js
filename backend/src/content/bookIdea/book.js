import { v4 as uuid } from "uuid";

async function createColl(db) {
  return db.collection("books");
}

// This gets all books for an author
export async function allBooks(db, userId) {
  const coll = await createColl(db);
  try {
    const books = await coll.find({ userId }).sort({ createdAt: -1 }).toArray();
    return books;
  } catch (e) {
    console.error(e);
  }
}

export async function getBook(db, bookId) {
  const coll = await createColl(db);
  try {
    const book = await coll.findOne({ _id: bookId });
    return book;
  } catch (e) {
    console.error(e);
  }
}

// This adds several books for an author
// Can be used from manual addition of a new book (but it must be in an array with single element)
// or from book generator (ideas)
export async function addBooks(db, userId, books) {
  const coll = await createColl(db);
  try {
    const tbaBooks = books.map((book) => {
      return {
        ...book,
        userId: userId,
        createdAt: new Date(),
        _id: uuid(),
      };
    });
    const result = await coll.insertMany(tbaBooks);
    if (result.acknowledged) {
      const insertedBooks = tbaBooks.map((book, index) => {
        return {
          _id: result.insertedIds[index],
          title: book.title,
          description: book.description,
        };
      });
      return {
        status: "success",
        message: "Books added",
        data: insertedBooks,
      };
    } else {
      return {
        status: "error",
        message: "Books not added",
      };
    }
  } catch (e) {
    console.error(e);
  }
}

// This updates the basic info of a book, either the title or the description only
export async function updateBook(db, bookId, book) {
  const coll = await createColl(db);
  try {
    const dbBook = await coll.findOne({ _id: bookId });
    if (dbBook) {
      const tbuBook = { ...dbBook, ...book };
      const result = await coll.updateOne({ _id: bookId }, { $set: tbuBook });
      if (result.matchedCount > 0) {
        const updatedBook = await coll.findOne({ _id: bookId });
        return {
          status: "success",
          message: "Book updated",
          data: updatedBook,
        };
      } else {
        return {
          status: "error",
          message: "Book not updated",
        };
      }
    }
  } catch (e) {
    console.error(e);
  }
}
