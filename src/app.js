import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import axios from "axios";
import fs from "fs";
import { fileURLToPath } from "url";

import registerRoute from "./routes/user.routes.js";
import resumeRoute from "./routes/resume.routes.js";
import landingRoute from "./routes/landing.routes.js";

import {Resume} from "./models/resume.models.js";
import PDFDocument from "pdfkit";
import { verifyJWT } from "./middlewares/auth.middlewares.js";
import setUser from "./middlewares/setUser.middlewares.js";

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
import { set } from "mongoose";
// const engine = require("ejs-mate");
app.engine("ejs", engine);

//Setting up Path
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.use( setUser);

app.get("/", (req, res) => {
  res.redirect("/home");
})

//For download Resume
app.get("/download-pdf", verifyJWT, async (req, res) => {
  const resume = await Resume.findOne({ owner: req.user._id });

  if (!resume) return res.status(404).send("Resume not found");

  const doc = new PDFDocument({ size: "A4", margin: 0 });
  res.setHeader("Content-Disposition", "attachment; filename=resume.pdf");
  res.setHeader("Content-Type", "application/pdf");
  doc.pipe(res);

  /* ================= COLORS ================= */
  const primaryColor = "#1F2937"; // Dark Gray
  const sidebarColor = "#F3F4F6"; // Light Gray

  /* ================= SIDEBAR ================= */
  doc.rect(0, 0, 170, 842).fill(sidebarColor);

  /* ================= PROFILE IMAGE ================= */
  if (resume?.profile) {
    try {
      const response = await axios.get(resume.profile, {
        responseType: "arraybuffer",
      });

      const imageBuffer = Buffer.from(response.data, "binary");

      doc.save();
      doc.circle(85, 110, 45).clip();
      doc.image(imageBuffer, 40, 65, { width: 90 });
      doc.restore();
    } catch (err) {
      console.log("Cloudinary image load failed:", err.message);
    }
  }



  /* ================= SIDEBAR CONTENT ================= */
  doc
    .fillColor(primaryColor)
    .font("Helvetica-Bold")
    .fontSize(14)
    .text("CONTACT", 20, 180);

  doc
    .font("Helvetica")
    .fontSize(10)
    .text(req.user.email, 20, 205, { width: 130 })
    .moveDown(0.5)
    .text(resume.phone)
    .moveDown(0.5)
    .text(resume.address, { width: 130 });

  doc.font("Helvetica-Bold").fontSize(14).text("SKILLS", 20, 300);

  doc.font("Helvetica").fontSize(10).text(resume.skills, {
    width: 130,
    lineGap: 4,
  });

  doc.font("Helvetica-Bold").fontSize(14).text("HOBBIES", 20, 420);

  doc.font("Helvetica").fontSize(10).text(resume.hobbies, { width: 130 });

  /* ================= MAIN CONTENT ================= */
  doc.fillColor(primaryColor);

  // Name
  doc.font("Helvetica-Bold").fontSize(26).text(req.user.fullname, 200, 60);

  // Role
  doc
    .font("Helvetica")
    .fontSize(13)
    .text(resume.profession || "Software Developer", 200, 95);

  /* ================= SECTION HELPER ================= */
  const section = (title, y) => {
    doc.font("Helvetica-Bold").fontSize(14).text(title, 200, y);

    doc
      .moveTo(200, y + 18)
      .lineTo(550, y + 18)
      .stroke();
  };

  /* ================= OBJECTIVE ================= */
  section("CAREER OBJECTIVE", 140);
  doc.font("Helvetica").fontSize(11).text(resume.careerObjective, 200, 165, {
    width: 330,
    align: "justify",
  });

  /* ================= EXPERIENCE ================= */
  section("EXPERIENCE", 260);
  doc.fontSize(11).text(`${resume.experience} Years`, 200, 285);

  /* ================= EDUCATION ================= */
  section("EDUCATION", 340);
  doc.fontSize(11).text(resume.education, 200, 365, { width: 330 });

  /* ================= STRENGTHS ================= */
  section("STRENGTHS", 440);
  doc.fontSize(11).text(resume.strength, 200, 465, { width: 330 });

  doc.end();
});




app.use("/", landingRoute);
app.use("/users", registerRoute);
app.use("/resume", resumeRoute);

export default app;
