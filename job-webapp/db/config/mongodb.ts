import { MongoClient } from "mongodb";

let client: MongoClient | null = null;
let db: ReturnType<MongoClient["db"]> | null = null;
let initError: Error | null = null;

function getDatabase() {
  if (db) return db;
  if (initError) throw initError;
  
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    initError = new Error("MONGODB_URI environment variable is not set");
    throw initError;
  }
  
  try {
    client = new MongoClient(uri);
    db = client.db("Jolt-Jordan");
    return db;
  } catch (err) {
    initError = err as Error;
    throw err;
  }
}

// Lazy proxy that only initializes when a method is actually called
export const database = new Proxy({} as ReturnType<MongoClient["db"]>, {
  get(_target, prop: string | symbol) {
    // Return a function that lazily gets the real database
    const realDb = getDatabase();
    const value = (realDb as any)[prop];
    if (typeof value === "function") {
      return value.bind(realDb);
    }
    return value;
  }
});