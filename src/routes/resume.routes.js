import { Router } from "express";
import {
  createResume,
  editResume,
} from "../controllers/resume.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/createResume").post(createResume);

router.route("/editResume").post(verifyJWT, editResume);

export default router;
