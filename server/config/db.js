import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import { ApiError } from "../errors/ApiError.js";

dotenv.config();
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

let db;

export const connectDB = async () => {
    try {
        await client.connect();
        db = client.db(process.env.MONGODB_DBNAME || "project_logictrace");
        console.log("MongoDB connected successfully!");
    } catch (err) {
        console.error("MongoDB connection failed:", err);
        throw new ApiError("Failed to connect to the Database.", 500);
    }
};

export const getDB = async () => {
    if (!db) {
        throw new ApiError("Database not connected.", 500);
    }
    return db;
};
