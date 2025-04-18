const express = require("express")
const {login, register, refreshToken} = require("../controllers/userController")

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/refresh', refreshToken)

module.exports = router

