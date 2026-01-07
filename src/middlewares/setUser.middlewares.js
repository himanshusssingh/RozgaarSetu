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
    const resume = await Resume.findOne({ owner: user._id });

    res.locals.currUser = user || null;
    res.locals.currProfile = resume.profile || null;
    next();
  } catch (err) {
    res.locals.currUser = null;
    next(); // ❗ NEVER throw here
  }
};

export default setUser;
