import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

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

const editCompanyForm = asyncHandler(async (req, res) => {
  const company = await Company.findOne({ owner: req.user._id });
  res.render("editCompany", { company });
});

const editCompany = asyncHandler(async (req, res) => {
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

  if (
    [name, description, jobTitle, requireSkills, experience, careerLink].some(
      (field) => field?.trim() === "",
    )
  ) {
    res.render("error", { message: "All fields are required!" });
    return;
  }

  const company = await Company.findOne({ owner: req.user._id });

  if (!company) {
    res.render("error", { message: "Company not found!" });
    return;
  }

  company.name = name;
  company.description = description;
  company.jobTitle = jobTitle;
  company.requireSkills = requireSkills;
  company.experience = experience;
  company.jobLocation = jobLocation;
  company.salary = salary;
  company.careerLink = careerLink;

  const updatedCompany = await company.save();

  if (!updatedCompany) {
    res.render("error", { message: "Failed to update company!" });
    return;
  }

  res.flash("success", "Company updated successfully!");
  return res.status(200).redirect("/home");
});

const deleteCompany = asyncHandler(async (req, res) => {
  const company = await Company.findOneAndDelete({ owner: req.user._id });

  if (!company) {
    res.render("error", { message: "Company not found!" });
    return;
  }

  res.flash("success", "Company deleted successfully!");
  return res.status(200).redirect("/home");
});

export { companyForm, createCompany, editCompanyForm, editCompany, deleteCompany };
