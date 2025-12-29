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

const createResume = asyncHandler(async (req, res) => {
  const { phone, address, linkdin, github, skills, education, experience, strength, hobbies } = req.body;
  const {owner} = req.user._id

  if (
    [
      phone,
      address,
      linkdin,
      github,
      skills,
      education,
      experience,
      strength,
      hobbies,
    ].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required.");
  }

//   const existedUser = await User.findOne({
//     $or: [{ username }, { email }],
//   });

//   if (existedUser) {
//     throw new ApiError(409, "User already existed!");
//   }

  // const avatarLocalPath = req.files?.avatar[0]?.path;

  // let coverImageLocalPath;
  // if (
  //   req.files &&
  //   Array.isArray(req.files.coverImage) &&
  //   req.files.coverImage.length > 0
  // ) {
  //   coverImageLocalPath = req.files.coverImage[0].path;
  // }

  // if (!avatarLocalPath) {
  //   throw new ApiError(400, "Avatar file is required");
  // }

  // const avatar = await uploadOnCloudinary(avatarLocalPath);
  // const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  // if (!avatar) {
  //   throw new ApiError(400, "Avatar file is required.");
  // }

  const resume = await Resume.create({
    // avatar: avatar.url,
    // coverImage: coverImage?.url || "",
    phone,
    address,
    linkdin,
    github,
    skills,
    education,
    experience,
    strength,
    hobbies,
    phone,
    address,
    linkdin,
    github,
    skills,
    education,
    experience,
    strength,
    hobbies,
    owner
  });

  const createdResume = await Resume.findById(resume._id);

  if (!createdResume) {
    throw new ApiError(500, "Something went wrong while creating resume.");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdResume, "Resume created successfully."));
});



// const editResume = asyncHandler(async (req, res) => {
//   const { fullname, email } = req.body;

//   if (!fullname || !email) {
//     throw new ApiError(409, "Fulname and Email is required.");
//   }

//   const user = await User.findByIdAndUpdate(
//     req?.user._id,
//     {
//       $set: {
//         fullname,
//         email, // Check while debugging
//       },
//     },
//     { new: true },
//   ).select("-password -refreshToken");

//   return res
//     .status(200)
//     .json(new ApiResponse(200, user, "All details are Updated."));
// });

// const changeAvatar = asyncHandler(async (req, res) => {
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
//   editResume,
};
