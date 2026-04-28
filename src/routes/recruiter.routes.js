import { Router } from "express";

import { companyForm, createCompany, editCompanyForm, editCompany, deleteCompany } from "../controllers/recruiter.controllers.js";

import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/createJOb").get(verifyJWT, companyForm).post(verifyJWT, createCompany);

router.route("/editJob").get(verifyJWT, editCompanyForm).post(verifyJWT, editCompany);

router.route("/deleteJob").post(verifyJWT, deleteCompany);

export default router;