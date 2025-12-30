import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import registerRoute from "./routes/user.routes.js";
import resumeRoute from "./routes/resume.routes.js";
import landingRoute from "./routes/landing.routes.js";

import {Resume} from "./models/resume.models.js";
import PDFDocument from "pdfkit";
import { verifyJWT } from "./middlewares/auth.middlewares.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


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

//For Layouts
import engine from "ejs-mate";
// const engine = require("ejs-mate");
app.engine("ejs", engine);

//Setting up Path
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.redirect("/home");
})

app.get("/download-pdf",verifyJWT, async (req, res) => {

  console.log(req.user);
  const resume = await Resume.findOne({owner: req?.user._id});

  const doc = new PDFDocument();
  res.setHeader("Content-Disposition", "attachment; filename=resume.pdf");
  doc.pipe(res);

  doc.fontSize(18).text("Resume", { align: "center" });
  doc.moveDown();

  doc.fontSize(12).text(`Name: ${req.user.fullname}`);
  doc.text(`Email: ${req.user.email}`);
  doc.text(`Phone: ${resume.phone}`);
  doc.text(`Address: ${resume.address}`);
  doc.text(`Skills: ${resume.skills}`);
  doc.text(`Experience: ${resume.experience} Years`);
  doc.text(`Education: ${resume.education}`);
  doc.text(`Career Objective: ${resume.careerObjective}`);
  doc.text(`Strength: ${resume.strength}`);
  doc.text(`Hobbies: ${resume.hobbies}`);

  doc.end();
});


app.use("/", landingRoute);
app.use("/users", registerRoute);
app.use("/resume", resumeRoute);

export default app;
