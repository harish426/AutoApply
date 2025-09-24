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
    requireVisaSponsorship: { type: Boolean, default: false },
    presentVisaStatus: { type: String },

    // Demographics
    disabilityStatus: { type: Boolean, default: false },
    veteranStatus: { type: Boolean, default: false },
    hispanicOrLatino: { type: Boolean, default: false },

    // Preferences
    willingToRelocate: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserProfile", userProfileSchema);
