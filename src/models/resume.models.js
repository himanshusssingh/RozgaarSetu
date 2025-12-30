import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate";

const resumeSchema = new Schema(
  {
    profile: {
      type: String, //cloudinary url
      required: false,
    },
    phone: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    skills: {
      type: String,
      required: true,
    },
    education: {
      type: String,
      required: true,
    },
    experience: {
      type: String,
      required: true,
    },
    careerObjective: {
      type: String,
      required: true,
    },
    strength: {
      type: String,
      required: true,
    },
    hobbies: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

resumeSchema.plugin(mongooseAggregatePaginate);

export const Resume = mongoose.model("Resume", resumeSchema);
