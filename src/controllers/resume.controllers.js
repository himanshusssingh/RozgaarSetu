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

const resumeForm = (req, res) => {
  res.render("resumeForm");
}

const createResume = asyncHandler(async (req, res) => {
  const { phone, address, skills, education, experience, careerObjective, strength, hobbies } = req.body;

console.log(phone)

  const owner = req.user._id

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
    throw new ApiError(400, "All fields are required.");
  }

  const existedResume = await Resume.findOne({
    $or: [{ phone }, { owner }],
  });

  if (existedResume) {
    throw new ApiError(409, "Resume already existed!");
  }

  const profileLocalPath = req.file?.path;

  console.log("______________");

  if (!profileLocalPath) {
    throw new ApiError(400, "Profile file is required");
  }

  const profile = await uploadOnCloudinary(profileLocalPath);

  if (!profile) {
    throw new ApiError(400, "Profile file is required.");
  }

  const resume = await Resume.create({
    profile: profile.url,
    phone,
    address,
    skills,
    education,
    experience,
    careerObjective,
    strength,
    hobbies,
    owner
  });

  const createdResume = await Resume.findById(resume._id);

  if (!createdResume) {
    throw new ApiError(500, "Something went wrong while creating resume.");
  }

  req.flash("success", "Resume created successfully.");


  return res
    .status(201)
    .redirect("/resume");
    // .json(new ApiResponse(200, createdResume, "Resume created successfully."));
});

const editResumeForm = asyncHandler(async(req, res) => {
  const resume = await Resume.findOne({ owner: req.user._id });
  res.render("editResume", {resume});
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

  if (!phone || !address || !skills || !education || !experience || !careerObjective || !strength || !hobbies) {
    throw new ApiError(409, "Data are required.");
  }

  const resume = await Resume.findOneAndUpdate(
    {owner: req?.user._id},
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
  )

  if(!resume) {
    throw new ApiError(404, "Resume not found.")
  }

  req.flash("success", "Resume edited successfully.");


  return res
    .status(200)
    .redirect("/resume")
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

export {
  createResume,
  editResume,
  resumeForm,
  editResumeForm,
};
