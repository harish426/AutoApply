const authUtil = require("./authutil");
const profile = require("./profilehandler");

/**
 * handles login (Google)
 */
async function handleLogin(req, res) {
  const loginres = await authUtil.userLogin(req, res);
  return loginres;
}

/**
 * SaveProfile
 */
async function handleSaveProfile(req, res) {
  const profileres = await profile.handleSaveProfile(req, res);
  return profileres;
}

module.exports = {
  handleLogin,
  handleSaveProfile,
};
