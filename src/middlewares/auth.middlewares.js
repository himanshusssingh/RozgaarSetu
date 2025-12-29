import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";

const verifyJWT = asyncHandler(async (req, _, next) => {
  const incomingAccessToken =
    req.cookies.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!incomingAccessToken) {
    throw new ApiError(401, "Unathorised");
  }

  try {
    const decodedToken = jwt.verify(
      incomingAccessToken,
      process.env.ACCESS_TOKEN_SECRET,
    );

    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken",
    );

    if (!user) {
      throw new ApiError(401, "Unathorized, User not found.");
    }

    req.user = user;

    next();
  } catch (err) {
    throw new ApiError(401, err.message || "Invalid Access Token.");
  }
});

export { verifyJWT };
