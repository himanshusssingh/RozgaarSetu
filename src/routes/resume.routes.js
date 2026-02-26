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

const router = Router();

router.route("/createResume")
.get(resumeForm)
.post(
  verifyJWT,
  upload.single("profile"),
  createResume,
);

router.route("/editResume")
.get(verifyJWT, editResumeForm)
.post(verifyJWT, editResume);
// router
//   .route("/changeProfile")
//   .post(verifyJWT, upload.single("profile"), changeProfile);

router.get("/downloadResume", verifyJWT, downloadResume);

export default router;
