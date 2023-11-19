const mongoose = require("mongoose");
const mongoURI =
  "mongodb+srv://baburamDb:test123@cluster401.tm5jsxu.mongodb.net/?retryWrites=true&w=majority";

const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("connected to mongodb database");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};

module.exports = connectToMongo;
