const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    let connection = await mongoose.connect(`${process.env.MONGO_URI}`);
    console.log(`DB connected to ${connection.connection.host}`);
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
