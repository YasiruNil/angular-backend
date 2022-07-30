const {
  addProduct,
  getProducts,
  productCount,
  removeProduct,
  updateProduct,
  getSingleProduct,
  getProductFeatured,
  updateGalaryProduct,
  getProductFeaturedCount,
} = require("../controller/product");
const api = process.env.API_URL;
const { uploadImage } = require("../helper/uploadImage");
const { authJwt } = require("../helper/jwt");
module.exports = (app) => {
  app.get(`${api}/products`, getProducts);
  app.get(`${api}/product/count`, productCount);
  app.get(`${api}/product/:id`, getSingleProduct);
  app.delete(`${api}/product/:id`, removeProduct);
  app.get(`${api}/product/featured`, getProductFeatured);
  app.get(`${api}/product/featured/:count`, getProductFeaturedCount);
  app.put(`${api}/product/:id`, uploadImage.single("image"), updateProduct);
  app.post(`${api}/product`, uploadImage.single("image"), addProduct);
  app.patch(
    `${api}/product/galary-images/:id`,
    uploadImage.array("images", 10),
    updateGalaryProduct
  );
};
