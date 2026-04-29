import { Router } from "express";
import {
  createResume,
  editResume,
  editResumeForm,
  resumeForm,
  downloadResume,
  // changeProfile,
} from "../controllers/resume.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { isUser } from "../middlewares/role.middlewares.js";

const router = Router();

router.route("/createResume")
.get(resumeForm)
.post(
  verifyJWT,
  isUser,
  upload.single("profile"),
  createResume,
);

router.route("/editResume")
.get(verifyJWT, isUser, editResumeForm)
.post(verifyJWT, isUser, editResume);
// router
//   .route("/changeProfile")
//   .post(verifyJWT, upload.single("profile"), changeProfile);

router.get("/downloadResume", verifyJWT, isUser, downloadResume);

export default router;
