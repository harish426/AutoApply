const User = require("./models/User");
const UserProfile = require("./models/userprofile");

async function handleSaveProfile(req, res) {
  // try {
  //   const email = req.params.email; // get email from URL
  //   const data = req.body;

  //   const user = await User.findOne({ email });

  //   if (!user) {
  //     return res.status(404).json({ error: "User not found" });
  //   }

  //   let profile = await UserProfile.findOne({ user: user._id });

  //   if (profile) {
  //     Object.assign(profile, data); // update existing profile
  //   } else {
  //     profile = new UserProfile({ user: user._id, ...data }); // new profile
  //   }

  //   await profile.save();

  //   res.status(200).json({ message: "Profile saved successfully", profile });
  // } catch (err) {
  //   console.error("Save profile error:", err);
  //   res.status(500).json({ error: "Internal server error" });
  // }

  try {
    const email = req.params.email; // get email from URL
    const data = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find or create profile
    let profile = await UserProfile.findOne({ user: user._id });
    if (profile) {
      Object.assign(profile, data); // update existing profile
    } else {
      profile = new UserProfile({ user: user._id, ...data }); // new profile
    }

    // Handle uploaded file if exists
    if (req.file) {
      profile.resume = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
        filename: req.file.originalname,
      };
    }

    await profile.save();

    res
      .status(200)
      .json({ message: "Profile and document saved successfully", profile });
  } catch (err) {
    console.error("Save profile and upload error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { handleSaveProfile };
