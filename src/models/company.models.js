import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate";

const companySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    jobTitle: {
      type: String,
      required: true,
    },
    requireSkills: {
      type: String,
      required: true,
    },
    experience: {
      type: String,
      required: true,
    },
    jobLocation: {
      type: String,
      required: false,
    },
    salary: {
      type: String,
      required: false,
    },
    careerLink: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

companySchema.plugin(mongooseAggregatePaginate);

export const Company = mongoose.model("Company", companySchema);
