const mongoose = require("mongoose");
const { MONGO_URI } = require("../config");

module.exports.dbconnect = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connect to database");
  } catch (e) {
    console.log(e.message);
  }
};
