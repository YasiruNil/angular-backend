const {
  addOrder,
  getOrders,
  orderCount,
  totalSales,
  userOrders,
  removeOrder,
  updateOrder,
  stripPayment,
  getSingleOrder,
} = require("../controller/order");
const api = process.env.API_URL;
module.exports = (app) => {
  app.post(`${api}/order`, addOrder);
  app.get(`${api}/orders`, getOrders);
  app.put(`${api}/order/:id`, updateOrder);
  app.get(`${api}/order/count`, orderCount);
  app.delete(`${api}/order/:id`, removeOrder);
  app.get(`${api}/order/:id`, getSingleOrder);
  app.post(`${api}/create-checkout-session`, stripPayment)
  app.get(`${api}/orders/totalsales`, totalSales);
  app.get(`${api}/user/orders/:userId`, userOrders);
};
