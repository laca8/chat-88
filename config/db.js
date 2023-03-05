const mongoose = require("mongoose");
const dbUrl = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://laca:jae09908@cluster0.gjxhg.mongodb.net/chat88?retryWrites=true&w=majority",
      {}
    );
    console.log("mongodb connected....");
  } catch (err) {
    console.log(err);
  }
};
module.exports = dbUrl;
