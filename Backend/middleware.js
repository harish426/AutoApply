function handleError(err, req, res, next) {
  console.error(err);
  res.status(500).json({ error: "Unexpected error occurred." });
}

module.exports = {
  handleError,
};
