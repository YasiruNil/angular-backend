const isAdmin = (req, res, next) => {
  if (req.userDetails.isAdmin === false) {
    return res.status(403).json({
      error: "Admin Access Denied",
    });
  }
  next();
};
module.exports = {
  isAdmin,
};
