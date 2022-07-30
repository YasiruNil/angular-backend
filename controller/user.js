const mongoose = require("mongoose");
const User = require("../models/user");
const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const addUser = (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bycrypt.hashSync(req.body.password, 10),
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    street: req.body.street,
    apartment: req.body.apartment,
    zip: req.body.zip,
    country: req.body.country,
  });
  user
    .save()
    .then((saveUser) => {
      res.status(200).json(saveUser);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        success: false,
      });
    });
};
const updateUser = async (req, res) => {
  if (!mongoose.isValidObjectId) return res.status(400).send("invalid user id");

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
      // passwordHash: bycrypt.hashSync(req.body.password, 10),
      phone: req.body.phone,
      isAdmin: req.body.isAdmin,
      street: req.body.street,
      apartment: req.body.apartment,
      zip: req.body.zip,
      country: req.body.country,
    },
    { new: true }
  );
  if (!user) return res.status(500).send("the user cannot be updated");
  return res.status(200).send(user);
};
const getUsers = async (req, res) => {
  const userList = await User.find().select("-passwordHash");
  if (!userList) {
    return res.status(500).json({ success: false });
  }
  return res.send(userList);
};
const getSingleUsers = async (req, res) => {
  const user = await User.find({ _id: req.params.id }).select("-passwordHash");
  if (!user) {
    return user.length === 0 && res.status(500).json({ success: false });
  }
  return res.send(user[0]);
};
const userLogin = async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
  });
  if (!user) return res.status(400).send("no user under given email");
  if (!req.body.password) return res.status(400).send("no password entered");
  if (user && bycrypt.compareSync(req.body.password, user.passwordHash)) {
    const token = jwt.sign(
      {
        userId: user.id,
        isAdmin: user.isAdmin,
      },
      "secret",
      { expiresIn: "1d" }
    );
    return res.status(200).send({ message: "user Authenticated", user, token });
  } else {
    return res.status(400).send("password is incorrect");
  }
};
const userCount = async (req, res) => {
  const userCount = await User.countDocuments({});

  if (userCount) return res.send({ userCount: userCount });
  return res.status(500).json({ success: false, message: err });
};
const removeUser = (req, res) => {
  User.findByIdAndRemove(req.params.id)
    .then((user) => {
      if (user) {
        return res
          .status(200)
          .json({ success: true, message: "User is deleted" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "user is found" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, message: err });
    });
};
module.exports = {
  addUser,
  getUsers,
  userCount,
  userLogin,
  removeUser,
  updateUser,
  getSingleUsers,
};
