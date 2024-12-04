const userController = require("../controllers/user.controller")
const Router = require('express')
const router = new Router()
const authMiddleware = require('../middleware/auth.middleware')
const roleMiddleware = require('../middleware/role.middleware')

router.post ('/registration',userController.UserController.createUser)
router.post ('/login',userController.UserController.createToken)
router.get ('/user/:id',authMiddleware,userController.UserController.getOneUser)
router.delete ('/user/:id',authMiddleware,roleMiddleware(['default_user','admin']),userController.UserController.deleteUser)
router.put ('/user/:id',authMiddleware,roleMiddleware(['default_user','admin']),userController.UserController.updateUser)

router.get ('/users',roleMiddleware(['admin']),userController.AdminController.getAllUsers)
router.put ('/role/:id',roleMiddleware(['admin']),userController.AdminController.setUserRole)

module.exports = router
