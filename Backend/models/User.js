const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Create a Mongoose model based on the defined schema, named 'User'
const User = mongoose.model("User", userSchema);

// Export the User model for use in other parts of the application
module.exports = User;
