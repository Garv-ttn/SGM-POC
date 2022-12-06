/* eslint-disable no-undef */
const express = require("express");
const { PORT } = require("./config");
const { dbconnect } = require("./db/dbconnect");
const errorHandler = require("./middlewares/errorHandler");
const cors = require("cors");
const path = require("path");

const app = express();

// middleware
app.use(express.static(path.join(__dirname, "/client/build")));

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.use("/configurations", require("./routes/cfg.route"));

// mock server api
app.use("/v1", require("./routes/api.route"));

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "/client/build", "index.html"));
});

// Error Responder
app.use(errorHandler);

// DB Connection
dbconnect();

app.listen(PORT, () => console.log("Server running at port", PORT));
