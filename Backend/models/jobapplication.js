const mongoose = require("mongoose");

const JobApplicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    jobTitle: {
      type: String,
      required: true,
      trim: true,
    },
    jobDescription: {
      type: String,
      required: true,
    },
    hrEmail: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/.+@.+\..+/, "Please provide a valid email"],
    },
    referrals: {
      name: String,
      email: {
        type: String,
        trim: true,
        lowercase: true,
        match: [/.+@.+\..+/, "Please provide a valid email"],
      },
      relation: String,
    },
    customResume: {
      data: Buffer,
      contentType: String,
      filename: String,
      url: String,
    },
    jobMatchPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    requiredSkills: [
      {
        type: String,
        trim: true,
      },
    ],
    status: {
      type: String,
      enum: [
        "Applied",
        "Rejected",
        "Selected",
        "InProgress",
        "Liked",
        "NotApplied",
      ],
      default: "NotApplied",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("JobApplication", JobApplicationSchema);
