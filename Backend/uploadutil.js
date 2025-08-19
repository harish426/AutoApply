//const User = require("./models/User");
//const UserProfile = require("./models/userprofile");

// async function handleUploadDocument(req, res) {
//   try {
//     const email = req.params.email;
//     const user = await User.findOne({ email });

//     if (!user) return res.status(404).json({ error: "User not found" });

//     const filePath = req.file.path;

//     let profile = await UserProfile.findOne({ user: user._id });
//     if (!profile) {
//       profile = new UserProfile({ user: user._id });
//     }

//     profile.resume = filePath;
//     await profile.save();

//     res
//       .status(200)
//       .json({ message: "Document uploaded successfully", path: filePath });
//   } catch (err) {
//     console.error("Upload error:", err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// }

// module.exports = { handleUploadDocument };

const fs = require("fs");
const User = require("./models/User");
const UserProfile = require("./models/userprofile");

/**
 * Upload Resume to DB
 */
// async function handleUploadDocument(req, res) {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: "No file uploaded" });
//     }

//     const email = req.params.email;
//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ error: "User not found" });

//     let profile = await UserProfile.findOne({ user: user._id });
//     if (!profile) {
//       profile = new UserProfile({ user: user._id });
//     }

//     profile.resume = {
//       data: req.file.buffer, // Use buffer directly
//       contentType: req.file.mimetype,
//       filename: req.file.originalname,
//     };

//     await profile.save();

//     res
//       .status(200)
//       .json({ message: "Document uploaded to database successfully" });
//   } catch (err) {
//     console.error("Upload error:", err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// }

async function handleDownloadDocument(req, res) {
  try {
    const email = req.params.email;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const profile = await UserProfile.findOne({ user: user._id });
    if (!profile || !profile.resume || !profile.resume.data) {
      return res.status(404).json({ error: "No document found" });
    }

    res.set({
      "Content-Type": profile.resume.contentType,
      "Content-Disposition": `attachment; filename="${profile.resume.filename}"`,
    });

    res.send(profile.resume.data); // send binary data directly from DB
  } catch (err) {
    console.error("Download error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  //handleUploadDocument,
  handleDownloadDocument,
};
