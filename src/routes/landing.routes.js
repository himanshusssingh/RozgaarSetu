import { Router } from "express";
import {
  homepage,
  resumePage,
  companyPages,
  skillsPage,
  allCompanyPage,
} from "../controllers/landing.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { isUser } from "../middlewares/role.middlewares.js";

const router = Router();

router.route("/home").get(homepage);

router.route("/resume").get(verifyJWT, isUser, resumePage);

router.route("/company").get(verifyJWT, isUser, companyPages);

router.route("/skills").get(skillsPage);

router.route("/allCompany").get(allCompanyPage);

export default router;
