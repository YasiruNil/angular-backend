const { expressjwt: expressJwt } = require("express-jwt");

const authJwt = () => {
  return expressJwt({
    secret: "secret",
    algorithms: ["HS256"],
  }).unless({
    path: [
      { url: "/api/v1/product", methods: ["GET", "OPTIONS"] },
      { url: "/api/v1/category", methods: ["GET", "OPTIONS"] },
      "/api/v1/user/login",
      "/api/v1/user/register",
    ],
  });
};
module.exports = { authJwt };
