const NewsController = require("../controllers/news.controller")
const Router = require('express')
const router = new Router()

router.get('/news',NewsController.NewsController.getAllNews)

router.post('/news',NewsController.NewsUserController.createNews)
router.put('/news',NewsController.NewsUserController.updateNews)
router.get('/news/:id',NewsController.NewsUserController.getUserNews)

router.put('/news/:id',NewsController.NewsModerController.setNewsStatus)
router.get('/news',NewsController.NewsModerController.getUnApprovedNews)

router.delete('/news/:id',NewsController.NewsAdminController.deleteNews)
router.put('/news/admin/:id',NewsController.NewsAdminController.changeNews)

module.exports = router
