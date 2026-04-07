import mongoose, { connect } from "mongoose";
import { dbName } from "../constant.js";

const DBURI =
  `${process.env.MONGODB_URI}` || `mongodb://127.0.0.1:27017/${dbName}`;

const connectDB = async () => {
  try {
    const connectionDB = await mongoose.connect(DBURI);
    console.log(
      `Database connected successfully. || DB host: ${connectionDB.connection.host}`,
    );
  } catch (err) {
    console.log("Database Connection error: ", err);
    process.exit(1);
  }
};

export { connectDB };
