import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

import { User } from "../models/user.models.js";
import { Resume } from "../models/resume.models.js";

import jwt from "jsonwebtoken";

import PDFDocument from "pdfkit";
import axios from "axios";

const resumeForm = (req, res) => {
  res.render("resumeForm");
};

const createResume = asyncHandler(async (req, res) => {
  const {
    phone,
    address,
    skills,
    education,
    experience,
    careerObjective,
    strength,
    hobbies,
  } = req.body;

  console.log(phone);

  const owner = req.user._id;

  console.log(owner);

  if (
    [
      phone,
      address,
      skills,
      education,
      experience,
      careerObjective,
      strength,
      hobbies,
    ].some((field) => field?.trim() === "")
  ) {
    // throw new ApiError(400, "All fields are required.");
    res.render("error", {message: "All fields are required!"});
    return;
  }

  const existedResume = await Resume.findOne({
    $or: [{ phone }, { owner }],
  });

  if (existedResume) {
    // throw new ApiError(409, "Resume already existed!");
    res.render("error", {message: "Resume already existed!"});
    return;
  }

  let userProfile;

  if (req.file?.path) {
    const profileLocalPath = req.file?.path;

    console.log("______________");

    if (!profileLocalPath) {
      // throw new ApiError(400, "Profile local path is not found.");
      res.render("error", {message: "Profile local path is not found."});
      return;
    }

    const profile = await uploadOnCloudinary(profileLocalPath);

    if (!profile) {
      // throw new ApiError(400, "Profile is not found.");
      res.render("error", {message: "Profile is not found."});
      return;
    }

     userProfile = profile.url;
  } else {
     userProfile =
      "https://res.cloudinary.com/dpercqknb/image/upload/v1771603352/User_fzpdhx.jpg";
  }

  const resume = await Resume.create({
    profile: userProfile,
    phone,
    address,
    skills,
    education,
    experience,
    careerObjective,
    strength,
    hobbies,
    owner,
  });

  const createdResume = await Resume.findById(resume._id);

  if (!createdResume) {
    // throw new ApiError(500, "Something went wrong while creating resume.");
    res.render("error", {message: "Something went wrong while creating resume."});
    return;
  }

  req.flash("success", "Resume created successfully.");

  return res.status(201).redirect("/resume");
  // .json(new ApiResponse(200, createdResume, "Resume created successfully."));
});

const editResumeForm = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ owner: req.user._id });
  res.render("editResume", { resume });
});

const editResume = asyncHandler(async (req, res) => {
  const {
    phone,
    address,
    skills,
    education,
    experience,
    careerObjective,
    strength,
    hobbies,
  } = req.body;

  if (
    !phone ||
    !address ||
    !skills ||
    !education ||
    !experience ||
    !careerObjective ||
    !strength ||
    !hobbies
  ) {
    // throw new ApiError(409, "Data are required.");
    res.render("error", {message: "Data are required!"});
    return;
  }

  const resume = await Resume.findOneAndUpdate(
    { owner: req?.user._id },
    {
      $set: {
        phone,
        address,
        skills,
        education,
        experience,
        careerObjective,
        strength,
        hobbies,
      },
    },
    { new: true },
  );

  if (!resume) {
    // throw new ApiError(404, "Resume not found.");
    res.render("error", {message: "Resume not found!"});
    return;
  }

  req.flash("success", "Resume edited successfully.");

  return res.status(200).redirect("/resume");
  // .json(new ApiResponse(200, resume, "All details are Updated."));
});

// const changeProfile = asyncHandler(async (req, res) => {
//   const avatarLocalPath = req.file?.path;

//   if (!avatarLocalPath) {
//     throw new ApiError(400, "Avatar file is missing");
//   }

//   // todo for delete old image.
//   // Find current user
//   const user = await User.findById(req.user._id);
//   if (!user) {
//     throw new ApiError(404, "User not found");
//   }

//   // Delete old image from Cloudinary (if exists)
//   if (user.avatar) {
//     // Extract the public_id from the old Cloudinary URL
//     const publicId = user.avatar.split("/").pop().split(".")[0];
//     try {
//       await deleteFromCloudinary(publicId);
//     } catch (error) {
//       console.log("Error deleting old image:", error.message);
//     }
//   }

//   const avatar = await uploadOnCloudinary(avatarLocalPath);

//   if (!avatar.url) {
//     throw new ApiError(
//       400,
//       "Something went wrong while uploadig avatar file on cloud.",
//     );
//   }
// console.log(avatar.url)
//   await User.findByIdAndUpdate(
//     req.user._id,
//     {
//       $set: {
//         avatar: avatar.url,
//       },
//     },
//     { new: true },
//   ).select("-password -refreshToken");

//   return res
//     .status(200)
//     .json(new ApiResponse(200, avatar.url, "Avatar changed Successfully."));
// });

const downloadResume = asyncHandler(async (req, res) => {
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

export { createResume, editResume, resumeForm, editResumeForm, downloadResume };
