import mongoose, { connect } from "mongoose";
import { dbName } from "../constant.js";


const connectDB = async () => {
  try {
    const connectionDB = await mongoose.connect(`${process.env.MONGODB_URI}/${dbName}`);
    console.log(`Database connected successfully. || DB host: ${connectionDB.connection.host}`);
  } catch (err) {
    console.log("Database Connection error: ", err);
    process.exit(1);
  }
};

export { connectDB };
