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
            sameSite: "Strict",
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

        if(!isMatch) {
            return res.status(400).json({message: "Password wrong!"})
        }

        const access = createAccessToken(user)
        const refresh = createRefreshToken(user)

        if(!access || !refresh) {
            return res.status(400).json({message: "Token not created!"})
        }

        res.cookie('refreshToken', refresh, {
            httpOnly: true,
            sameSite: "Strict",
            maxAge: remember ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000
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

const refreshToken = async (req, res) => {
    try {
        const refresh = req.cookies.refreshToken;

        if(!refresh) {
            return res.status(400).json({message: "refresh token not found!"})
        }

        const decoded = jwt.verify(refresh, process.env.REFRESH_TOKEN)

        const user = await User.findById(decoded.id)

        if(!user) {
            return res.status(401).json({message: "User not founded!"})
        }

        const access = createAccessToken(user)

        res.json({
            token: access
        })

    }catch(err) {
        return res.status(400).json({Error: err.message, message: "refresh token error"})
    }
}

module.exports = {register, login, refreshToken}