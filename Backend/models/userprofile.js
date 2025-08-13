const mongoose = require("mongoose");

const experienceSchema = new mongoose.Schema({
  employer: String,
  jobTitle: String,
  startDate: Date,
  endDate: Date,
  roleDescription: String,
});

const educationSchema = new mongoose.Schema({
  school: String,
  degree: String,
  fieldOfStudy: String,
});

const userProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    firstName: { type: String, required: true },
    middleName: String,
    lastName: { type: String, required: true },

    cellPhone: String,
    homePhone: String,
    workPhone: String,
    linkedIn: String,

    address: {
      country: String,
      addressLine1: String,
      addressLine2: String,
      city: String,
      state: String,
      zipCode: String,
    },

    hearAboutUs: String,

    experiences: [experienceSchema],

    educations: [educationSchema],

    certifications: [String],

    skills: [String],

    resume: {
      data: Buffer, // store file content
      contentType: String, // store MIME type (e.g., application/pdf)
      filename: String, // optional: store original filename
    },

    workAuthorization: {
      authorizedToWorkInUS: Boolean,
      requireVisaSponsorship: Boolean,
    },

    ethnicity: String,
    veteranStatus: String,
    disabilities: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserProfile", userProfileSchema);
