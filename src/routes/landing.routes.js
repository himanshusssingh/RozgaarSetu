import { Router } from "express";
import {
  homepage,
  resumePage,
  companyPages,
  skillsPage,
  allCompanyPage,
} from "../controllers/landing.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/home").get(homepage);

router.route("/resume").get(verifyJWT, resumePage);

router.route("/company").get(verifyJWT, companyPages);

router.route("/skills").get(skillsPage);

router.route("/allCompany").get(allCompanyPage);

export default router;
