const {
  addUser,
  getUsers,
  userCount,
  userLogin,
  removeUser,
  updateUser,
  getSingleUsers,
} = require("../controller/user");
const { isAdmin } = require("../helper/adminAuth");
const { authJwt } = require("../helper/jwt");
const api = process.env.API_URL;
module.exports = (app) => {
  app.post(`${api}/user`, addUser);
  app.get(`${api}/users`, getUsers);
  app.post(`${api}/login`, userLogin);
  app.put(`${api}/user/:id`, updateUser);
  app.get(`${api}/user/count`, userCount);
  app.delete(`${api}/user/:id`, removeUser);
  app.get(`${api}/user/:id`, getSingleUsers);
};
