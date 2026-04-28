import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";

import { Company } from "../models/company.models.js";
import { User } from "../models/user.models.js";

const companyForm = asyncHandler(async (req, res) => {
  res.render("companyForm");
});

const createCompany = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    jobTitle,
    requireSkills,
    experience,
    jobLocation,
    salary,
    careerLink,
  } = req.body;

  const owner = req.user._id;

  if (
    [name, description, jobTitle, requireSkills, experience, careerLink].some(
      (field) => field?.trim() === "",
    )
  ) {
    res.render("error", { message: "All fields are required!" });
    return;
  }

  if (!owner) {
    res.render("error", { message: "Unauthorized!" });
    return;
  }

  const company = new Company({
    owner,
    name,
    description,
    jobTitle,
    requireSkills,
    experience,
    jobLocation,
    salary,
    careerLink,
  });

  const savedCompany = await company.save();

  if (!savedCompany) {
    res.render("error", { message: "Failed to create company!" });
    return;
  }

  res.flash(success, "Company created successfully!");

  return res.status(201).redirect("/home");
});

export { companyForm, createCompany };
