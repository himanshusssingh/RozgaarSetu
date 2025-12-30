import { Router } from "express";
import {
  createResume,
  // editResume,
  // changeProfile,
} from "../controllers/resume.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/createResume").post(
  verifyJWT,
  upload.single("profile"),
  createResume,
);

// router.route("/editResume").post(verifyJWT, editResume);
// router
//   .route("/changeProfile")
//   .post(verifyJWT, upload.single("profile"), changeProfile);

export default router;
