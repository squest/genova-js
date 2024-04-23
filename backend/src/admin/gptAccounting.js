import { v4 as uuid } from 'uuid';

// This is a sample request to record a new request
// types of request include: bookIdeas, chapters, sections, and sectionContent
const sampleRequest = {
  "type" : "bookIdeas",
  "gptVersion" : "gpt-3",
  "userId" : "sabdaps@gmail.com",
  "inputToken" : 321,
  "outputToken" : 123,
  "totalToken" : 444
}

async function createColl(db) {
  return db.collection('gptAccountingRecords');
}

// Record a new request report
async function recordRequest(db, request) {
  const coll = await createColl(db);
  try {
    const tbaRequest = await coll.insertOne({
      ...request,
      "_id": uuid()
    });
    if (tbaRequest) {
      return {
        "status": "success",
        "message": "Request recorded",
        "data": tbaRequest
      }
    } else {
      return {
        "status": "error",
        "message": "Request not recorded"
      }
    }
  } catch (e) {
    console.error(e);
  }
}

// Get requests by author
async function requestsByUser(db, userId) {
  const coll = await createColl(db);
  try {
    const requests = await coll.find({ userId }).toArray();
    return requests;
  } catch (e) {
    console.error(e);
  }
}

// Get requests by type
async function requestsByType(db, type) {
  const coll = await createColl(db);
  try {
    const requests = await coll.find({ type }).toArray();
    return requests;
  } catch (e) {
    console.error(e);
  }
}

export { recordRequest, requestsByUser, requestsByType };


