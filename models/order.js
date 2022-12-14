const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderItems: [
    { type: mongoose.Schema.Types.ObjectId, ref: "OrderItem", default: [] },
  ],
  shippingAddress1: { type: String },
  shippingAddress2: { type: String },
  city: { type: String },
  zip: { type: String },
  country: { type: String },
  phone: { type: String },
  status: { type: String, default: "pending", required: true },
  totalPrice: {
    type: Number,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  dateOrdered: {
    type: Date,
    default: Date.now,
  },
});
orderSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
orderSchema.set("toJSON", {
  virtuals: true,
});
module.exports = mongoose.model("Order", orderSchema);
