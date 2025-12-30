import express from "express";
import cors from "cors";
// import healthcheckRouter from "./routes/healthcheck.routes.js";
import cookieParser from "cookie-parser";
import registerRoute from "./routes/user.routes.js";
import resumeRoute from "./routes/resume.routes.js";

const app = express();

// common config
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// app.use("/api/v1/healthcheck", healthcheckRouter);
app.get("/", (req, res) => {
  res.send("hii")
})

app.use("/api/users", registerRoute);
app.use("/api/resume", resumeRoute);

export default app;
