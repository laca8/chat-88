const mongoose = require("mongoose");
const connDB = async () => {
  try {
    await mongoose.connect(process.env.MONOG_URI);
    console.log("db connected....");
  } catch (err) {
    console.log(err);
  }
};
module.exports = connDB;
