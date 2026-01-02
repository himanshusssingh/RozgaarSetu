import { User } from "../models/user.models.js";
import { Resume } from "../models/resume.models.js";
import { Company } from "../models/company.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const homepage = (req, res) => {
  res.render("home");
};

const indexpage = asyncHandler(async(req, res) => {
  const user = req.user;
    const resume = await Resume.findOne({owner: req?.user._id})
    res.render("index", {resume, user});
});

const skillsPage = asyncHandler(async(req, res) => {
  res.render("skills");
})

const companyPages = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({owner: req.user._id});
  const companies = await Company.find();

  let eligible = [];

  const resumeSkills = resume.skills
    .toLowerCase()
    .split(",")
    .map((s) => s.trim());

  companies.forEach((c) => {
    if (!c.requireSkills) return;

    // Company skills → array
    const companySkills = c.requireSkills
      .toLowerCase()
      .split(",")
      .map(s => s.trim());

    // Match logic
    const matched = companySkills.some(companySkill =>
      resumeSkills.some(resumeSkill =>
        companySkill.includes(resumeSkill)
      )
    );

    if (matched) {
      eligible.push(c);
    }
  });

  // 12. If no company matched
  if (eligible.length === 0) {
    res.redirect("/skills");
  } else {
      res.render("companies", { eligible });

    // let output = "<h2>Eligible Companies</h2>";
    // eligible.forEach((c) => {
    //   output += `
    //   <div>
    //     <p><b>${c.name}</b></p>
    //     Skill Required: ${c.skill}<br>
    //     Experience: ${c.experience}<br>
    //     <form action="apply.html">
    //       <button>Apply</button>
    //     </form>
    //   </div><hr>`;
    // });
    // res.send(output);
  }
});


export { homepage, indexpage, companyPages, skillsPage };
