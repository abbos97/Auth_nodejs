require('dotenv').config()
const express = require("express");
const router = require("./routers/router");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser")

const app = express()
app.use(express.json())
app.use(cookieParser())

connectDB()
app.use('/', router)

const PORT = process.env.PORT || 3007

app.listen(PORT, () => {
    console.log("Server is running port:", PORT)
})
