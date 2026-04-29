import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.models.js";

const isUser = asyncHandler(async (req, res, next) => {
  const role = req.user.role;

  if (!role) {
    req.flash("error", "Login to access this resource");
    return res.redirect("/users/login");
    throw new ApiError(403, "Forbidden, No role assigned.");
  }

  try {
    if (role === "user") {
      return next();
    } else {
      req.flash("error", "You don't have permission to access this resource");
      return res.redirect("/home");
      throw new ApiError(
        403,
        "Forbidden, You don't have permission to access this resource.",
      );
    }
  } catch (err) {
    throw new ApiError(
      403,
      err.message ||
        "Forbidden, You don't have permission to access this resource.",
    );
  }
});

const isRecruiter = asyncHandler(async (req, res, next) => {
  const role = req.user.role;

  if (!role) {
    req.flash("error", "Login to access this resource");
    return res.redirect("/users/login");
    throw new ApiError(403, "Forbidden, No role assigned.");
  }

  try {
    if (role === "recruiter") {
      return next();
    } else {
      req.flash("error", "You don't have permission to access this resource");
      return res.redirect("/home");
      throw new ApiError(
        403,
        "Forbidden, You don't have permission to access this resource.",
      );
    }
  } catch (err) {
    throw new ApiError(
      403,
      err.message ||
        "Forbidden, You don't have permission to access this resource.",
    );
  }
});

export { isUser, isRecruiter };
