const mongoose = require("mongoose");


exports.connectedDatabase = async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Database connected");
    } catch (error) {
        console.log(error);
    }
}