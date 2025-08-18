const authUtil = require("./authutil");
const profile = require("./profilehandler");
const uploads = require("./uploadutil");

/**
 * Handles login (Google)
 */
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

/**
 * Save Profile
 */
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

/**
 * Upload Resume
 */
async function handleUploads(req, res, next) {
  try {
    const uploadsresume = await uploads.handleUploadDocument(req, res);
    return uploadsresume;
  } catch (error) {
    console.error("Error in handleUploads:", error.message || error);
    error.message = "Failed to upload resume. Please try again.";
    next(error);
  }
}

/**
 * Download Resume
 */
async function handleDownload(req, res, next) {
  try {
    const downloadRes = await uploads.handleDownloadDocument(req, res);
    return downloadRes;
  } catch (error) {
    console.error("Error in handleDownload:", error.message || error);
    error.message = "Failed to download resume. Please try again.";
    next(error);
  }
}

module.exports = {
  handleLogin,
  handleSaveProfile,
  handleUploads,
  handleDownload,
};
