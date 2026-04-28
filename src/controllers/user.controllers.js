import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
// import {
//   uploadOnCloudinary,
//   deleteFromCloudinary,
// } from "../utils/cloudinary.js";
import { User } from "../models/user.models.js";
import { Resume } from "../models/resume.models.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendEmail, emailVerificationMailgenContent } from "../utils/mail.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log("Can not generate access and refresh token : ", error);
    throw new ApiError(
      500,
      "Something went wrong while generating access or refresh token.",
    );
  }
};

const registerForm = (req, res) => {
  res.render("registerForm");
};

const registerUser = asyncHandler(async (req, res) => {
  const { role, fullname, email, username, password } = req.body;

  if (
    [role, username, email, fullname, password].some((field) => field?.trim() === "")
  ) {
    // throw new ApiError(400, "All fields are required.");
    res.render("error", { message: "All fields are required." });
    return;
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    // throw new ApiError(409, "User already existed!");
    res.render("error", { message: "User already existed!" });
    return;
  }

  const user = await User.create({
    role,
    fullname,
    username,
    email,
    password,
    isEmailVerified: false,
  });

  const { unHashedToken, hashedToken, tokenExpiry } =
    user.generateTemporaryToken();

  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpiry = tokenExpiry;

  await user.save({ validateBeforeSave: false });

  await sendEmail({
    email: user?.email,
    subject: "Please verify your email.",
    mailgenContent: emailVerificationMailgenContent(
      user.username,
      `${req.protocol}://${req.get("host")}/users/verifyEmail/${unHashedToken}`,
    ),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
  );

  if (!createdUser) {
    // throw new ApiError(500, "Something went wrong while creating user.");
    res.render("error", {
      message: "Something went wrong while creating user.",
    });
    return;
  }

  req.flash(
    "success",
    "You're register successfully and verification email sent.",
  );

  return (
    res
      .status(201)
      // .json(new ApiResponse(200, createdUser, "User registered successfully."))
      .redirect("/users/login")
  );
});

const loginForm = (req, res) => {
  res.render("loginForm");
};

const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!email && !username) {
    // throw new ApiError(400, "Email is required!");
    res.render("error", { message: "Email and Username is required!" });
    return;
  }

  const user = await User.findOne({ $or: [{ username }, { email }] });

  if (!user) {
    // throw new ApiError(404, "User not exist!");
    res.render("error", { message: "User not exist!" });
    return;
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    // throw new ApiError(401, "Password is incorrect!");
    res.render("error", { message: "Password is incorrect!" });
    return;
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id,
  );

  const loggedUser = await User.findById(user._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
  );

  const options = {
    httpOnly: true,
    secure: true,
  };


  req.flash("success", "User login successfully.");

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .redirect("/home");
});

const logoutUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    { new: true },
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  req.flash("success", "User Logout Successfully");
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .redirect("/home");
  // .json(new ApiResponse(200, "User logout successfully."));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshAccessToken;

  if (!incomingRefreshToken) {
    // throw new ApiError(401, "Unathoreised Access.");
    res.render("error", { message: "Unathoreised Access!" });
    return;
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );

    const user = await User.findById(decodedToken._id);

    if (!user) {
      // throw new ApiError(401, "Invalid refresh token.");
      res.render("error", { message: "Invalid refresh token!" });
      return;
    }

    if (incomingRefreshToken !== user.refreshToken) {
      // throw new ApiError(401, "Refresh token is expired.");
      res.render("error", { message: "Refresh token is expired!" });
      return;
    }

    const { accessToken, refreshAccessToken: newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { user: accessToken, newRefreshToken },
          "Access Token refresh successfully.",
        ),
      );
  } catch (err) {
    // throw new ApiError(401, "invalid refresh token.");
    res.render("error", { message: "Invalid refresh token!" });
    return;
  }
});

const updatePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    // throw new ApiError(409, "Old password and new password is required.");
    res.render("error", {
      message: "Old password and new password is required!",
    });
    return;
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    // throw new ApiError(404, "Unathorezed access.");
    res.render("error", { message: "Unathorezed access!" });
    return;
  }

  const isPasswordValid = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordValid) {
    res.render("error", { message: "Old Password is incorrect!" });
    return;
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  req.flash("success", "Password changed successfully.");

  return res.status(200).redirect("/home");
  // .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req?.user, "Current user sended successfully."));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullname, email } = req.body;

  if (!fullname || !email) {
    // throw new ApiError(409, "Fulname and Email is required.");
    res.render("error", { message: "Fullname and Email is required!" });
    return;
  }

  const user = await User.findByIdAndUpdate(
    req?.user._id,
    {
      $set: {
        fullname,
        email, // Check while debugging
      },
    },
    { new: true },
  ).select("-password -refreshToken");

  req.flash("success", "Profile Updated Successfully");

  return res.status(200).redirect("/home");
  // .json(new ApiResponse(200, user, "All details are Updated."));
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { verificationToken } = req.params;

  if (!verificationToken) {
    // throw new ApiError(400, "Email Verification token is not found!");
    res.render("error", { message: "Email Verification token is not found!" });
    return;
  }

  let hashedToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  console.log("Hashed Token : ", hashedToken);

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpiry: { $gt: Date.now() },
  });

  if (!user) {
    // throw new ApiError(400, "Token is invalid or expired.");
    res.render("error", { message: "Token is invalid or expired!" });
    return;
  }

  user.emailVerificationExpiry = undefined;
  user.emailVerificationToken = undefined;

  user.isEmailVerified = true;

  await user.save({ validateBeforeSave: false });

  req.flash("success", "Email verified successfully.");

  return res.status(200).redirect("/home");
});

const resendEmailVerification = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    // throw new ApiError(404, "User not found!");
    res.render("error", { message: "User not found!" });
    return;
  }

  if (!user.isEmailVerified) {
    // throw new ApiError(409, "Email already confirmed");
    res.render("error", { message: "Email already confirmed!" });
    return;
  }

  const { unHashedToken, hashedToken, tokenExpiry } =
    user.generateTemporaryToken();

  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpiry = tokenExpiry;

  await user.save({ validateBeforeSave: false });

  await sendEmail({
    emai: user?.email,
    subject: "Please verify your email.",
    mailgenContent: emailVerificationMailgenContent(
      user.username,
      `${req.protocol}://${req.get("host")}/users/verifyEmail/${unHashedToken}`,
    ),
  });

  req.flash("success", "Verification email resent successfully.");

  return res.status(200).redirect("/home");
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  updatePassword,
  getCurrentUser,
  updateAccountDetails,
  registerForm,
  loginForm,
  verifyEmail,
  resendEmailVerification,
};
