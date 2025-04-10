const { NewsController, NewsUserController, NewsModerController, NewsAdminController } = require("../controllers/news.controller");
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');
const Router = require('express');
const router = new Router();

router.get('/news',NewsController.getAllNews);
router.get('/newsTheme',NewsController.getNewsForTheme);

router.post('/news',authMiddleware,roleMiddleware(['default_user','moderator','admin']),NewsUserController.createNews);
router.put('/news',authMiddleware,roleMiddleware(['default_user','moderator','admin']),NewsUserController.updateNews);
router.get('/news/:id',authMiddleware,roleMiddleware(['default_user','moderator','admin']),NewsUserController.getUserNews);


router.get('/moder',authMiddleware,roleMiddleware(['moderator','admin']),NewsModerController.getUnApprovedNews);
router.put('/moder/:id',authMiddleware,roleMiddleware(['moderator','admin']),NewsModerController.setNewsStatus);

router.post('/news/admin',authMiddleware,roleMiddleware(['admin']),NewsAdminController.createNewsTheme);
router.delete('/news/admin/:id',authMiddleware,roleMiddleware(['admin']),NewsAdminController.deleteNewsTheme);
router.delete('/news/:id',authMiddleware,roleMiddleware(['admin']),NewsAdminController.deleteNews);

module.exports = router;