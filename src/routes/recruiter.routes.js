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
import { isRecruiter } from "../middlewares/role.middlewares.js";

const router = Router();

router.get("/jobs", verifyJWT, isRecruiter, recruiterJobs);

router
  .route("/jobs/:id/edit")
  .get(verifyJWT, isRecruiter, editCompanyForm)
  .post(verifyJWT, isRecruiter, editCompany);
router.post("/jobs/:id/delete", verifyJWT, isRecruiter, deleteCompany);

router
  .route("/createJob")
  .get(verifyJWT, isRecruiter, companyForm)
  .post(verifyJWT, isRecruiter, createCompany);

export default router;
