const authUtil = require("./authutil");
const profile = require("./profilehandler");

// Handles login (Google)
async function handleLogin(req, res, next) {
  try {
    const loginres = await authUtil.userLogin(req, res);
    return loginres;
  } catch (error) {
    console.error("Error in handleLogin:", error.message || error);
    error.message = "Failed to process login. Please try again later.";
    next(error);
  }
}

// Save Profile
async function handleSaveProfile(req, res, next) {
  try {
    const profileres = await profile.handleSaveProfile(req, res);
    return profileres;
  } catch (error) {
    console.error("Error in handleSaveProfile:", error.message || error);
    error.message = "Failed to save user profile. Please try again.";
    next(error);
  }
}

// fetch profile
async function handleGetProfile(req, res, next) {
  try {
    const profileres = await profile.handleGetProfile(req, res);
    return profileres;
  } catch (error) {
    console.error("Error in handleGetProfile:", error.message || error);
    error.message = "Failed to get profile. Please try again.";
    next(error);
  }
}

// Save the job applications
async function handleJobApplication(req, res, next) {
  try {
    const profileres = await profile.handleSaveJobApplication(req, res);
    return profileres;
  } catch (error) {
    console.error("Error in handleGetProfile:", error.message || error);
    error.message = "Failed to fetch user profile. Please try again.";
    next(error);
  }
}

// Fetch all job applications for a user
async function handleGetJobApplications(req, res, next) {
  try {
    const applications = await profile.handleFetchJobApplications(req, res);
    return applications;
  } catch (error) {
    console.error("Error in handleGetJobApplications:", error.message || error);
    error.message = "Failed to fetch job applications. Please try again.";
    next(error);
  }
}

// Delete a job application for a user
async function handleDeleteJobApplication(req, res, next) {
  try {
    const deletedApp = await profile.handleDeleteJobApplication(req, res);
    return deletedApp;
  } catch (error) {
    console.error(
      "Error in handleDeleteJobApplication:",
      error.message || error
    );
    error.message = "Failed to delete job application. Please try again.";
    next(error);
  }
}

// Save or edit resume
async function handleSaveOrEditResume(req, res, next) {
  try {
    const savedResume = await profile.handleSaveResume(req, res);
    return savedResume;
  } catch (error) {
    console.error("Error in handleSaveOrEditResume:", error.message || error);
    error.message = "Failed to save or edit resume. Please try again.";
    next(error);
  }
}

// Get resume data
async function handleGetResumeData(req, res, next) {
  try {
    const resumeData = await profile.handleGetResume(req, res);
    return resumeData;
  } catch (error) {
    console.error("Error in handleGetResumeData:", error.message || error);
    error.message = "Failed to fetch resume data. Please try again.";
    next(error);
  }
}

module.exports = {
  handleLogin,
  handleSaveProfile,
  handleJobApplication,
  handleGetJobApplications,
  handleDeleteJobApplication,
  handleGetProfile,
  handleSaveOrEditResume,
  handleGetResumeData,
};
