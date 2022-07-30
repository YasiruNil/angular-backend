const Order = require("../models/order");
const stripe = require("stripe");
const OrderItem = require("../models/order-item");
const Product = require("../models/product");
const addOrder = async (req, res) => {
  const orderItemsIds = Promise.all(
    req.body.orderItems.map(async (orderItem) => {
      let newOrderItem = new OrderItem({
        quantity: orderItem.quantity,
        product: orderItem.product,
      });

      newOrderItem = await newOrderItem.save();

      return newOrderItem._id;
    })
  );
  const orderItemsIdsResolved = await orderItemsIds;

  const totalPrices = await Promise.all(
    orderItemsIdsResolved.map(async (orderItemId) => {
      const orderItem = await OrderItem.findById(orderItemId).populate(
        "product",
        "price"
      );
      const totalPrice = orderItem.product.price * orderItem.quantity;
      return totalPrice;
    })
  );

  const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

  let order = new Order({
    orderItems: orderItemsIdsResolved,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone,
    status: req.body.status,
    totalPrice: totalPrice,
    user: req.body.user,
  });
  order = await order.save();

  if (!order) return res.status(400).send("the order cannot be created!");

  res.send(order);
};
const getOrders = async (req, res) => {
  const orderList = await Order.find()
    .populate("user", "name")
    .sort({ dateOrdered: -1 });
  if (!orderList) {
    res.status(500).json({ success: false });
  }
  res.send(orderList);
};
const getSingleOrder = async (req, res) => {
  console.log(req.params.id);
  const orderList = await Order.findById(req.params.id)
    .populate("user", "name")
    .populate({
      path: "orderItems",
      populate: { path: "product", populate: "category" },
    });
  if (!orderList) {
    res.status(500).json({ success: false });
  }
  console.log(orderList);
  res.send(orderList);
};

const updateOrder = async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
    },
    { new: true }
  );
  if (!order) return res.status(500).send("the order cannot be updated");
  return res.status(200).send(order);
};
const removeOrder = (req, res) => {
  Order.findByIdAndRemove(req.params.id)
    .then((order) => {
      if (order) {
        return res
          .status(200)
          .json({ success: true, message: "order is removed" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "order is not found" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, message: err });
    });
};
const totalSales = async (req, res) => {
  const totalSales = await Order.aggregate([
    { $group: { _id: null, total_sales: { $sum: "$totalPrice" } } },
  ]);
  console.log(totalSales, "ss");
  if (!totalSales)
    return res.status(500).send("The order sales cannot be generated");

  return res.send({ total_sales: totalSales.pop().total_sales });
};

const orderCount = async (req, res) => {
  const orderCount = await Order.countDocuments({});

  if (orderCount) return res.send({ orderCount: orderCount });
  return res.status(500).json({ success: false, message: err });
};
const userOrders = async (req, res) => {
  const userOrderList = await Order.find({ user: req.params.userId })
    .populate({
      path: "orderItems",
      populate: { path: "product", populate: "category" },
    })
    .sort({ dateOrdered: -1 });
  if (!userOrderList) {
    res.status(500).json({ success: false });
  }
  res.send(userOrderList);
};
const stripPayment = async (req, res) => {
  const orderItem = req.body;
  if (!orderItem)
    return res
      .status(400)
      .send("checkout session cannot be created-check order items");
  const lineItems = await Promise.all(
    orderItem.map(async (ord) => {
      const product = await Product.findById(ord.product);
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
          },
          unit_amount: product.price * 100,
        },
        quantity: ord.quantity,
      };
    })
  );
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: "http://localhost:4200/success",
    cancle_url: "http://localhost:4200/error",
  });
  res.json({ id: session.id });
};

module.exports = {
  addOrder,
  getOrders,
  userOrders,
  totalSales,
  orderCount,
  updateOrder,
  removeOrder,
  stripPayment,
  getSingleOrder,
};
