const User = require("./models/User");
const Resume = require("./models/resume");
const UserProfile = require("./models/userprofile");
const JobApplication = require("./models/jobapplication");

// Save profile + optional resume
async function handleSaveProfile(req, res) {
  try {
    const email = req.params.email;
    const data = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    let profile = await UserProfile.findOne({ user: user._id });
    if (profile) Object.assign(profile, data);
    else profile = new UserProfile({ user: user._id, ...data });

    await profile.save();
    res.status(200).json({ message: "Profile saved successfully", profile });
  } catch (err) {
    console.error("Save profile error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Fetch profile
async function handleGetProfile(req, res) {
  try {
    const email = req.params.email;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const profile = await UserProfile.findOne({ user: user._id }).lean();
    if (!profile) return res.status(404).json({ error: "Profile not found" });

    res.status(200).json({
      message: "Profile fetched successfully",
      user: { id: user._id, email: user.email, name: user.name },
      profile,
    });
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Save job application
async function handleSaveJobApplication(req, res) {
  try {
    const email = req.params.email;
    const data = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    let jobApplication = await JobApplication.findOne({
      user: user._id,
      jobTitle: data.jobTitle,
      company: data.company,
    });
    if (jobApplication) Object.assign(jobApplication, data);
    else jobApplication = new JobApplication({ user: user._id, ...data });

    if (req.file) {
      jobApplication.customResume = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
        filename: req.file.originalname,
      };
    } else if (data.resumeUrl) {
      jobApplication.customResume = { url: data.resumeUrl };
    }

    await jobApplication.save();
    res
      .status(201)
      .json({ message: "Job application saved successfully", jobApplication });
  } catch (err) {
    console.error("Save job application error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Fetch job applications grouped
async function handleFetchJobApplications(req, res) {
  try {
    const email = req.params.email;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const applications = await JobApplication.find({ user: user._id })
      .select("-customResume.data")
      .lean();

    const grouped = {
      applied: applications.filter((app) => app.status === "Applied"),
      rejected: applications.filter((app) => app.status === "Rejected"),
      liked: applications.filter((app) => app.status === "Liked"),
    };

    res.status(200).json({
      message: "Job applications fetched successfully",
      applications: grouped,
    });
  } catch (err) {
    console.error("Fetch job applications error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Delete rejected applications
async function handleDeleteJobApplication(req, res) {
  try {
    const { email } = req.params;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const result = await JobApplication.deleteMany({
      user: user._id,
      status: "Rejected",
    });
    res.status(200).json({
      message: `${result.deletedCount} rejected applications deleted successfully`,
    });
  } catch (err) {
    console.error("Delete job application error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// SAVE or UPDATE Resume
async function handleSaveResume(req, res) {
  try {
    const email = req.params.email;
    const data = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // findOneAndUpdate ensures single document per user
    const resume = await Resume.findOneAndUpdate(
      { user: user._id }, // query by user
      { $set: data }, // update with new data
      { new: true, upsert: true } // return updated doc, create if missing
    );

    console.log("Saved resume data", resume);

    res.status(200).json({ message: "Resume saved successfully", resume });
  } catch (err) {
    console.error("Save resume error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// GET Resume
async function handleGetResume(req, res) {
  try {
    const email = req.params.email;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const resume = await Resume.findOne({ user: user._id }).lean();
    if (!resume) return res.status(404).json({ error: "Resume not found" });

    res.status(200).json({ message: "Resume fetched successfully", resume });
  } catch (err) {
    console.error("Get resume error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  handleSaveProfile,
  handleGetProfile,
  handleSaveJobApplication,
  handleFetchJobApplications,
  handleDeleteJobApplication,
  handleSaveResume,
  handleGetResume,
};
