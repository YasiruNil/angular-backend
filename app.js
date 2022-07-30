const express = require("express");
// const { authJwt } = require("./helper/jwt-new");
// const { errorHandler } = require("./helper/error-handler");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
// middleware
app.use(bodyParser.json());

// display log request in a specific format
app.use(morgan("tiny"));
app.options("*", cors());
// app.use(authJwt());
// app.use(errorHandler());
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));
require("dotenv/config");
require("./routes/products")(app);
require("./routes/orders")(app);
require("./routes/categories")(app);
require("./routes/users")(app);
mongoose
  .connect(process.env.MONGO_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "angular-ecom",
  })
  .then(() => {
    console.log("Database Connection is ready");
  })
  .catch((err) => {
    console.log("Database Connection is failed", err);
  });
app.listen(process.env.PORT, () => {
  console.log("server running");
});
