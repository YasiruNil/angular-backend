const errorHandler = (err, req, res, next) => {
  if (err && err.name === "UnauthorizedError")
    return res.status(401).json({ message: "user is not authorized" });
  if (err && err.name === "validationError")
    return res.status(401).json({ message: err });

  return err && res.status(500).json(err);
};
module.exports = { errorHandler };
