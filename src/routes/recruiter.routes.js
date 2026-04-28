import { Router } from "express";

import {
  companyForm,
  recruiterJobs,
  createCompany,
  editCompanyForm,
  editCompany,
  deleteCompany,
} from "../controllers/recruiter.controllers.js";

import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.get("/jobs", verifyJWT, recruiterJobs);

router
  .route("/jobs/:id/edit")
  .get(verifyJWT, editCompanyForm)
  .post(verifyJWT, editCompany);
router.post("/jobs/:id/delete", verifyJWT, deleteCompany);

router
  .route("/createJOb")
  .get(verifyJWT, companyForm)
  .post(verifyJWT, createCompany);

export default router;
