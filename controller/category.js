const Category = require("../models/category");
const addCategory = (req, res) => {
  const category = new Category({
    name: req.body.name,
    icon: req.body.icon,
    color: req.body.color,
  });
  category
    .save()
    .then((saveCategory) => {
      res.status(200).json(saveCategory);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        success: false,
      });
    });
};
const getCategories = async (req, res) => {
  const categoryList = await Category.find();
  if (!categoryList) {
    res.status(500).json({ success: false });
  }
  res.send(categoryList);
};
const getCategory = async (req, res) => {
  const singleCat = await Category.findById(req.params.id);
  if (!singleCat) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(singleCat);
};
const removeCategory = (req, res) => {
  Category.findByIdAndRemove(req.params.id)
    .then((category) => {
      if (category) {
        return res
          .status(200)
          .json({ success: true, message: "category is deleted" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "category is found" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, message: err });
    });
};
const putCategory = async (req, res) => {
  const cat = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      icon: req.body.icon,
      color: req.body.color,
    },
    { new: true }
  );
  if (!cat) return res.status(500).json({ success: false });

  return res.status(200).send(cat);
};
module.exports = {
  putCategory,
  addCategory,
  getCategory,
  getCategories,
  removeCategory,
};
