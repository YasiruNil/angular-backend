const mongoose = require("mongoose");
const Product = require("../models/product");
const Category = require("../models/category");

const addProduct = async (req, res) => {
  const category = await Category.findById(req.body.category);
  if (!category) return res.status(500).send("invalid category");
  const fileName = req.file.filename;
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

  const product = new Product({
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: `${basePath}${fileName}`,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured,
    dateCreated: Date.now(),
  });
  await product.save();
  if (!product) return res.status(500).send("product cannot be created");
  return res.send(product);
};
const getProducts = async (req, res) => {
  let filter = {};
  if (req.query.category) filter = { category: req.query.category.split(",") };
  const productList = await Product.find(filter).populate("category");
  if (!productList) {
    res.status(500).json({ success: false });
  }
  res.send(productList);
};
const getSingleProduct = async (req, res) => {
  const singleProduct = await Product.findById(req.params.id).populate(
    "category"
  );
  if (!singleProduct) {
    res.status(500).json({ success: false });
  }
  res.send(singleProduct);
};

const updateProduct = async (req, res) => {
  if (!mongoose.isValidObjectId)
    return res.status(400).send("invalid product id");
  const category = await Category.findById(req.body.category);
  if (!category) return res.status(500).send("invalid category");

  const file = req.file;
  let imagePath;

  if (file) {
    const fileName = file.filename;
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
    imagePath = `${basePath}${fileName}`;
  } else {
    imagePath = Product.image;
  }
  const prod = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      countInStock: req.body.countInStock,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: imagePath,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    },
    { new: true }
  );
  if (!prod) return res.status(500).send("the product cannot be updated");
  return res.status(200).send(prod);
};
const removeProduct = async (req, res) => {
  await Product.findByIdAndRemove(req.params.id)
    .then((product) => {
      if (product) {
        return res
          .status(200)
          .json({ success: true, message: "product is deleted" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "product is not found" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, message: err });
    });
};
const productCount = async (req, res) => {
  const productCount = await Product.countDocuments({});

  if (productCount) return res.send({ productCount: productCount });
  return res.status(500).json({ success: false, message: err });
};
const getProductFeatured = async (req, res) => {
  await Product.find({ isFeatured: true })
    .then((resp) => {
      return res.status(200).json(resp);
    })
    .catch((err) => {
      return res.status(500).json({ success: false, message: err });
    });
};
// + to make req.params.count type in number
const getProductFeaturedCount = async (req, res) => {
  await Product.find({ isFeatured: true })
    .limit(+req.params.count || 0)
    .then((resp) => {
      return res.status(200).json(resp);
    })
    .catch((err) => {
      return res.status(500).json({ success: false, message: err });
    });
};
const updateGalaryProduct = async (req, res) => {
  if (!mongoose.isValidObjectId)
    return res.status(400).send("invalid product id");
  let imagePaths = [];

  const files = req.files;
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
  if (files) {
    files.map((file) => {
      imagePaths.push(`${basePath}${file.filename}`);
    });
  }
  const productImage = await Product.findByIdAndUpdate(
    req.params.id,
    {
      images: imagePaths,
    },
    { new: true }
  );
  if (!productImage)
    return res.status(500).send("the product cannot be uploaded");
  return res.status(200).send(productImage);
};

module.exports = {
  addProduct,
  getProducts,
  productCount,
  removeProduct,
  updateProduct,
  getSingleProduct,
  getProductFeatured,
  updateGalaryProduct,
  getProductFeaturedCount,
};
