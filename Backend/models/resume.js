const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true, // every resume must be linked to a user
    },
    contact_info: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String },
      address: { type: String },
    },

    summary: { type: String },

    experience: [
      {
        title: String,
        company: String,
        dates: String,
        location: String,
        description: [String],
      },
    ],

    education: [
      {
        degree: String,
        institution: String,
        gpa: String,
      },
    ],

    skills: {
      Programming: [String], // e.g. ["JavaScript", "Python", "HTML", "CSS"]
      Tools: [String], // e.g. ["React", "Node.js", "Git", "Webpack"]
      Relevant_Courses: [String], // e.g. ["Data Structures", "Algorithms"]
    },

    projects: [
      {
        title: String,
        description: [String],
      },
    ],

    certifications: [
      {
        name: { type: String },
        organization: { type: String },
      },
    ],

    publications: [
      {
        name: { type: String, required: true },
        link: { type: String },
      },
    ], // new field added
  },
  { timestamps: true }
);

// Export in CommonJS style
module.exports = mongoose.model("Resume", resumeSchema);
