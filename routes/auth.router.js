const authController = require("../controllers/auth.controller")
const Router = require('express')
const router = new Router()

router.post ('/registration',authController.AuthController.createUser)
router.post ('/login',authController.AuthController.createToken)


module.exports = router
