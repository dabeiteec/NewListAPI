const { NewsController,
    NewsUserController,
    NewsModerController,
    NewsAdminController 
} = require("../controllers/news.controller")
const Router = require('express')
const router = new Router()
const authMiddleware = require('../middleware/auth.middleware')
const roleMiddleware = require('../middleware/role.middleware')

router.get('/news',NewsController.getAllNews)

// router.post('/news',authMiddleware,roleMiddleware(['default_user','moderator','admin']),NewsUserController.createNews)
// router.put('/news',authMiddleware,roleMiddleware(['default_user','moderator','admin']),NewsUserController.updateNews)
// router.get('/news/:id',authMiddleware,roleMiddleware(['default_user','moderator','admin']),NewsUserController.getUserNews)

// router.put('/news/:id',authMiddleware,roleMiddleware(['moderator','admin']),NewsModerController.setNewsStatus)
// router.get('/news',authMiddleware,roleMiddleware(['moderator','admin']),NewsModerController.getUnApprovedNews)

// router.post('/news/admin',authMiddleware,roleMiddleware(['admin']),NewsAdminController.createNewsTheme)
// router.delete('/news/admin/:id',authMiddleware,roleMiddleware(['admin']),NewsAdminController.deleteNewsTheme)
// router.delete('/news/:id',authMiddleware,roleMiddleware(['admin']),NewsAdminController.deleteNews)
router.post('/news',NewsUserController.createNews)
router.put('/news',NewsUserController.updateNews)
router.get('/news/:id',NewsUserController.getUserNews)

router.put('/moderator/:id',NewsModerController.setNewsStatus)
router.get('/moderator',NewsModerController.getUnApprovedNews)

router.post('/news/admin',authMiddleware,roleMiddleware(['admin']),NewsAdminController.createNewsTheme)
router.delete('/news/admin/:id',authMiddleware,roleMiddleware(['admin']),NewsAdminController.deleteNewsTheme)
router.delete('/news/:id',authMiddleware,roleMiddleware(['admin']),NewsAdminController.deleteNews)
module.exports = router
