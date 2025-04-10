const mongoose = require("mongoose")


let connected = false
const connectDB = async () => {
    try {
        mongoose.set('strictQuery', true)

        if(connected) {
            console.log("db connected already!!!")
            return;
        }

        await mongoose.connect(process.env.MONGODB_URI)
        console.log("connected success!!!")
        connected = true
    }
    catch(err) {
        console.log('Connect db error', err.message)
    }
}

module.exports = connectDB