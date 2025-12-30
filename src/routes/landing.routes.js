import { Router } from "express";
import {
  homepage,
  indexpage,
} from "../controllers/landing.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router
  .route("/home")
  .get(homepage)

router.route("/index").get(verifyJWT, indexpage);

export default router;
