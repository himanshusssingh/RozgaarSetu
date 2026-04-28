import { Router } from "express";

import { companyForm, createCompany } from "../controllers/recruiter.controllers.js";

import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/createJOb").get(verifyJWT, companyForm).post(verifyJWT, createCompany);

export default router;