const express = require("express");
const app = express();
const https = require("https");
const fs = require("fs");
const path = require("path"); //
const stylesRoutes = require("./src/styles/routes");
const customerRoutes = require("./src/customers/routes");
const locationRoutes = require("./src/locations/routes");
const checkoutRoutes = require("./src/checkouts/routes");
const qrSinglesRoutes = require("./src/qrSingles/routes");
const { createProxyMiddleware } = require("http-proxy-middleware");
var cors = require("cors");

const port = 3000;
app.listen(port, () => console.log("basic bitch on them donuts"));

app.use(express.json());

// ************

// Only Express

// ************

// React + Express

// const port = 443;

// const options = {
//   key: fs.readFileSync("server-key.pem"), // Path to your SSL key file
//   cert: fs.readFileSync("server-cert.pem"), // Path to your SSL certificate file
// };

// app.use(
//   "https://localhost:3000/", // Define the API path to proxy
//   createProxyMiddleware({
//     target: "https://localhost:443/api/v1/", // Replace with the URL of your Express server
//     secure: false, // Allow self-signed certificates (if applicable)
//     changeOrigin: true, // Change the origin of the request to match the target
//   }),
// );

// https.createServer(options, app).listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });

// app.use(express.static(path.join(__dirname, "../dont-over-think-it/build")));

app.use(cors());

app.use("/api/v1/customers", customerRoutes);

app.use("/api/v1/locations", locationRoutes);

app.use("/api/v1/checkouts", checkoutRoutes);

app.use("/api/v1/styles", stylesRoutes);

app.use("/api/v1/qr-single", qrSinglesRoutes);
