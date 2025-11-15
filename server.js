const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan("dev"));

const port = 3030;
mongodbConnect()
app.listen(port, () => {
  console.log(`app listening at http://localhost:3030`);
});

const SSLCommerzPayment = require("sslcommerz-lts");
const mongodbConnect = require("./db/mogodbConnect");
const store_id = "rolis68ecbe300bdfb";
const store_passwd = "rolis68ecbe300bdfb@ssl";
const is_live = false; //true for live, false for sandbox



app.post("/order", (req, res) => {
  const cart = req.body.cart;

  const total = cart.reduce((sum, { price }) => sum + price, 0);

  const data = {
    total_amount: total,
    currency: "BDT",
    tran_id: "REF123", // use unique tran_id for each api call
    success_url: "http://localhost:3030/success",
    fail_url: "http://localhost:3030/fail",
    cancel_url: "http://localhost:3030/cancel",
    ipn_url: "http://localhost:3030/ipn",
    shipping_method: "Courier",
    product_name: "Computer.",
    product_category: "Electronic",
    product_profile: "general",
    cus_name: "Customer Name",
    cus_email: "customer@example.com",
    cus_add1: "Dhaka",
    cus_add2: "Dhaka",
    cus_city: "Dhaka",
    cus_state: "Dhaka",
    cus_postcode: "1000",
    cus_country: "Bangladesh",
    cus_phone: "01711111111",
    cus_fax: "01711111111",
    ship_name: "Customer Name",
    ship_add1: "Dhaka",
    ship_add2: "Dhaka",
    ship_city: "Dhaka",
    ship_state: "Dhaka",
    ship_postcode: 1000,
    ship_country: "Bangladesh",
  };

  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
  sslcz.init(data).then(({ GatewayPageURL }) => {
    res.status(200).json({ url: GatewayPageURL });
  });
});

app.post("/success", (req, res) => {
  res.redirect("http://localhost:5173/payment-status?status=success");
});

app.post("/fail", (req, res) => {
  res.redirect("http://localhost:5173/payment-status?status=fail");
});

app.post("/cancel", (req, res) => {
  res.redirect("http://localhost:5173/payment-status?status=cancel");
});

// auth logics ---------------------------

app.post("/auth", (req, res) => {
  const user = req.body.user;
  return res.status(200).json(user);
});
