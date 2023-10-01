const express = require("express");
const app = express();

const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const helmet = require("helmet");
// const dotenv = require('dotenv');
const path = require("path");

const errorMiddleware = require("./middlewares/errors");

const cors = require("cors");

// Disable 'X-Powered-By' header to mitigate the "Server Leaks Information via 'X-Powered-By'" vulnerability.
app.disable("x-powered-by");

// Use helmet to enable various security headers, including CSP.
app.use(helmet());

// Allow requests only from a frontend origin
const corsOptions = {
  origin: "http://localhost:3000/",
};

app.use(cors(corsOptions));

// Define a CSP policy in your Express app.
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"], // Allow resources to be loaded from the same origin.
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  })
);

// Setting up config file
if (process.env.NODE_ENV !== "PRODUCTION")
  require("dotenv").config({ path: "backend/config/config.env" });
// dotenv.config({ path: 'backend/config/config.env' })

// Middleware to set the X-Content-Type-Options header
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  next();
});

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload());

// Import all routes
const products = require("./routes/product");
const auth = require("./routes/auth");
const payment = require("./routes/payment");
const order = require("./routes/order");

app.use("/api/v1", products);
app.use("/api/v1", auth);
app.use("/api/v1", payment);
app.use("/api/v1", order);

if (process.env.NODE_ENV === "PRODUCTION") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
  });
}

// Middleware to handle errors
app.use(errorMiddleware);

module.exports = app;
