const User = require("../models/User")
const connectDB = require("../config/database")
const jwt = require("jsonwebtoken")
const { createAccessToken, createRefreshToken } = require("../generate/accessToken")


const register = async (req, res) => {
    try {
        await connectDB()

        const {name, email, password, remember} = req.body

        const exUser = await User.findOne({email})

        if(exUser) {
            return res.status(400).json({message: "User exsists"})
        }

        const user = await User.create({name, email, password})

        if(!user) {
            res.status(400).json({message: "name, email or password somtheng went wrong!"})
        }

        const access = createAccessToken(user)
        const refresh = createRefreshToken(user)

        if(!access || !refresh) {
            return res.status(400).json({message: "Token not created!"})
        }

        res.cookie('refreshToken', refresh, {
            httpOnly: true,
            sameSite: "Strinct",
            maxAge: remember ? 30 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000
        })

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: access
        })
    }catch(err) {
        res.status(400).json({Error: err.message, message: 'register method'})
    }
}



const login = async (req, res) => {
    try {
        await connectDB()

        const { email, password, remember} = req.body

        const user = await User.findOne({email}).select("+password")

        if(!user) {
            res.status(400).json({message: "Email or password not correct!"})
        }

        const isMatch = await user.isMatchPassword(password)

        if(isMatch) {
            return res.status(400).json({message: "Password wrong!"})
        }

        

        const access = createAccessToken(user)
        const refresh = createRefreshToken(user)

        if(!access || !refresh) {
            return res.status(400).json({message: "Token not created!"})
        }

        res.cookie('refreshToken', refresh, {
            httpOnly: true,
            sameSite: "Strinct",
            maxAge: remember ? 30 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000
        })

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: access
        })
    }catch(err) {
        res.status(400).json({Error: err.message, message: 'register method'})
    }
}

module.exports = {register, login}