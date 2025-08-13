const authUtil = require("./authutil");
const profile = require("./profilehandler");
const uploads = require("./uploadutil");

/**
 * handles login (Google)
 */
async function handleLogin(req, res) {
  const loginres = await authUtil.userLogin(req, res);
  return loginres;
}

/**
 * Save Profile
 */
async function handleSaveProfile(req, res) {
  const profileres = await profile.handleSaveProfile(req, res);
  return profileres;
}

/**
 * Upload Resume
 */
async function handleUploads(req, res) {
  const uploadsresume = await uploads.handleUploadDocument(req, res);
  return uploadsresume;
}

/**
 * Download Resume
 */
async function handleDownload(req, res) {
  const downloadRes = await uploads.handleDownloadDocument(req, res);
  return downloadRes;
}

module.exports = {
  handleLogin,
  handleSaveProfile,
  handleUploads,
  handleDownload,
};
