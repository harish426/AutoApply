const mongoose = require("mongoose");

const userProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Basic Info
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    dateOfBirth: { type: Date },

    // Address
    address: {
      street1: { type: String, required: true },
      street2: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true },
    },

    // Work Authorization
    requireVisaSponsorship: {
      type: String,
      enum: ["Yes", "No"],
      default: "No",
    },
    presentVisaStatus: { type: String },

    // Demographics
    disabilityStatus: {
      type: String,
      enum: ["Yes", "No"],
      default: "No",
    },
    veteranStatus: {
      type: String,
      enum: ["Yes", "No"],
      default: "No",
    },
    hispanicOrLatino: {
      type: String,
      enum: ["Yes", "No"],
      default: "No",
    },

    // Preferences
    willingToRelocate: {
      type: String,
      enum: ["Yes", "No"],
      default: "No",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserProfile", userProfileSchema);
