const {
  getCategory,
  addCategory,
  putCategory,
  getCategories,
  removeCategory,
} = require("../controller/category");
const api = process.env.API_URL;
module.exports = (app) => {
  app.post(`${api}/category`, addCategory);
  app.get(`${api}/categories`, getCategories);
  app.get(`${api}/category/:id`, getCategory);
  app.put(`${api}/category/:id`, putCategory);
  app.delete(`${api}/category/:id`, removeCategory);
};
