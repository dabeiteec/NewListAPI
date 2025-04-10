const Router = require('express');
const router = new Router();
const roleMiddleware = require('../middleware/role.middleware');
const userController = require("../controllers/user.controller");
const authMiddleware = require('../middleware/auth.middleware');

router.get ('/user/:id',authMiddleware,userController.UserController.getOneUser);
router.put ('/user/:id',authMiddleware,roleMiddleware(['default_user','admin']),userController.UserController.updateUser);
router.delete ('/user/:id',authMiddleware,roleMiddleware(['default_user','admin']),userController.UserController.deleteUser);

router.get ('/users',roleMiddleware(['admin']),userController.AdminController.getAllUsers);
router.put ('/role/:id',roleMiddleware(['admin']),userController.AdminController.setUserRole);

module.exports = router;
