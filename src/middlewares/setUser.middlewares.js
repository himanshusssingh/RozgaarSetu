import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";
import { Resume } from "../models/resume.models.js";

const setUser = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      res.locals.currUser = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded._id).select(
      "-password -refreshToken",
    );

    if (!user) {
      res.locals.currUser = null;
      return next();
    }

    res.locals.currUser = user;

    const resume = await Resume.findOne({ owner: user._id });

    if (!resume) {
      res.locals.currProfile =
        "https://res.cloudinary.com/dpercqknb/image/upload/v1771603352/User_fzpdhx.jpg";
      next();
    } else {
      res.locals.currProfile = resume.profile;
      next();
    }
  } catch (err) {
    res.locals.currUser = null;
    next(); // ❗ NEVER throw here
  }
};

export default setUser;
