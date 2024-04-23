import { MongoClient } from "mongodb";

let db = null;

export default async function getDb(config) {
  if (db) return db;
  const mongoURI = config.MONGO_URI_ONLINE;
  const dbName = config.DB_NAME;
  try {
    console.log(`Connecting to database with URI: ${mongoURI}`);
    const client = new MongoClient(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();
    console.log("Successfully connected to database");
    db = client.db(dbName);
    return db;
  } catch (e) {
    console.error("Failed to connect to database", e);
    throw e; // Lebih baik throw error ini agar bisa lebih mudah ditangkap di tempat lain
  }
}
