import { v4 as uuid } from 'uuid';

// This is a sample request to record a new request
// types of request include: bookIdeas, chapters, sections, and sectionContent
const sampleGptResult = {
  "type" : "bookIdeas",
  "gptVersion" : "gpt3",
  "userId" : "sabdaps@gmail.com",
  "result" : "JSON of the result"
}

async function createColl(db) {
  return db.collection('gptResults');
}

async function addGptResult(db, result) {
  const coll = await createColl(db);
  try {
    const tbaResult = await coll.insertOne({
      ...result,
      "_id": uuid()
    });
    if (tbaResult) {
      return {
        "status": "success",
        "message": "Result recorded",
        "data": tbaResult
      }
    } else {
      return {
        "status": "error",
        "message": "Result not recorded"
      }
    }
  } catch (e) {
    console.error(e);
  }
}

// Get results by author
async function resultsByUser(db, userId) {
  const coll = await createColl(db);
  try {
    const results = await coll.find({ userId }).toArray();
    return results;
  } catch (e) {
    console.error(e);
  }
}

// Get results by type
async function resultsByType(db, type) {
  const coll = await createColl(db);
  try {
    const results = await coll.find({ type }).toArray();
    return results;
  } catch (e) {
    console.error(e);
  }
}

// Get results by Id
async function resultById(db, resultId) {
  const coll = await createColl(db);
  try {
    const result = await coll.findOne({ _id: resultId });
    return result;
  } catch (e) {
    console.error(e);
  }
}

export { addGptResult, resultsByUser, resultsByType, resultById };

