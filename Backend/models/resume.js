import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    contact_info: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String },
      address: { type: String },
    },
    summary: { type: String },

    education: [
      {
        degree: String,
        institution: String,
        gpa: String,
      },
    ],

    experience: [
      {
        title: String,
        company: String,
        dates: String,
        location: String,
        description: [String],
      },
    ],

    projects: [
      {
        title: String,
        description: [String],
      },
    ],

    skills: {
      Programming: [String],
      Tools: [String],
      Relevant_Courses: [String],
    },

    certifications: [String],
  },
  { timestamps: true }
);

const Resume = mongoose.model("Resume", resumeSchema);

export default Resume;
