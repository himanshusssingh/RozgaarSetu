import { User } from "../models/user.models.js";
import { Resume } from "../models/resume.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const homepage = (req, res) => {
  res.render("home");
};

const indexpage = asyncHandler(async(req, res) => {
  const user = req.user;
    const resume = await Resume.findOne({owner: req?.user._id})
    res.render("index", {resume, user});
});

export { homepage, indexpage };
