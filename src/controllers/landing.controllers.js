import { User } from "../models/user.models.js";
import { Resume } from "../models/resume.models.js";
import { Company } from "../models/company.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Home Page Controller
const homepage = (req, res) => {
  res.render("home");
};

// Resume Page Controller
const resumePage = asyncHandler(async (req, res) => {
  const user = req?.user;

  if (!user) {
    res.redirect("/login");
    return;
  }

  const resume = await Resume.findOne({ owner: user._id });

  if (!resume) {
    res.redirect("/resume/createResume");
    return;
  }

  const companies = await Company.find();

  let eligible = [];

  const normalizeSkills = (skills) =>
    skills
      .toLowerCase()
      .split(",")
      .map((s) => s.replace(/\./g, "").trim());
  
  if (!resume.skills) {
    res.redirect("/resume/createResume");
    return;
  }

  const resumeSkills = normalizeSkills(resume.skills);

  companies.forEach((c) => {
    if (!c.requireSkills) return;

    // Company skills → array
    const companySkills = normalizeSkills(c.requireSkills);

    // Match logic
    const matched = resumeSkills.some((resumeSkill) =>
      companySkills.includes(resumeSkill),
    );

    if (matched) {
      eligible.push(c);
    }
  });

  // 12. If no company matched
  let isEligible = true;
  if (eligible.length === 0) {
    isEligible = false;
  }

  res.render("resume", { resume, user, isEligible });
});

//Skill Page Controller
const skillsPage = asyncHandler(async (req, res) => {
  res.render("skills");
});

// Company Page Controller
const companyPages = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  if (!userId) {
    res.redirect("/login");
    return;
  }

  const resume = await Resume.findOne({ owner: userId });
  const companies = await Company.find();

  if (!resume) {
    res.redirect("/resume/createResume");
    return;
  }

  let eligible = [];

  const normalizeSkills = (skills) =>
    skills
      .toLowerCase()
      .split(",")
      .map((s) => s.replace(/\./g, "").trim());

  if (!resume.skills) {
    res.redirect("/resume/createResume");
    return;
  }

  const resumeSkills = normalizeSkills(resume.skills);

  companies.forEach((c) => {
    if (!c.requireSkills) return;

    // Company skills → array
    const companySkills = normalizeSkills(c.requireSkills);

    // Match logic
    const matched = resumeSkills.some((resumeSkill) =>
      companySkills.includes(resumeSkill),
    );

    if (matched) {
      eligible.push(c);
    }
  });

  const isAllCompany = false;

  // 12. If no company matched
  if (eligible.length === 0) {
    res.redirect("/skills");
  } else {
    res.render("companies", { eligible, userId, isAllCompany });
  }
});

// For All Company
const allCompanyPage = asyncHandler(async (req, res) => {
  const eligible = await Company.find();
  const userId = req.user.id;
  const isAllCompany = true;
  res.render("companies", { eligible, userId, isAllCompany });
});

export { homepage, resumePage, companyPages, skillsPage, allCompanyPage };
