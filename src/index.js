import app from "./app.js";
import dotenv, { config } from "dotenv";
import { connectDB } from "./db/index.js";

dotenv.config({
  path: "./.env",
});

const port = process.env.PORT || 8080;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is listening on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log("Database Connecton failed", err);
  });
