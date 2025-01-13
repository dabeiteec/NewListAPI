const {NewsServices, NewsUserServices, NewsModerServices} = require('../services/news.services');

class NewsController {
    async getAllNews(req, res) {
        try {
            const news = await NewsServices.getAllNews();
            res.json(news.rows);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Ошибка получения новостей' });
        }
    }
}

class NewsUserController {
    async createNews(req, res) {
        try {
            const { name, description, image, themeIds, authorId, isVerified } = req.body;

            if (!name || !description || !themeIds?.length || !authorId) {
                return res.status(400).json({ message: 'Заполните обязательные поля: name, description, themeIds, authorId' });
            }

            const newNews = await NewsUserServices.createNews({ name, description, image, themeIds, authorId, isVerified });
            res.status(201).json(newNews);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Ошибка создания новости' });
        }
    }

    async updateNews(req, res) {
        try {
            const { id, name, description, image, themeIds } = req.body;

            if (!id || !name || !description || !themeIds?.length) {
                return res.status(400).json({ message: 'Заполните обязательные поля: id, name, description, themeIds' });
            }

            const updatedNews = await NewsUserServices.updateNews({ id, name, description, image, themeIds });
            res.json(updatedNews);
        } catch (error) {
            console.error(error);
            res.status(error.status || 500).json({ message: error.message || 'Ошибка обновления новости' });
        }
    }

    async getUserNews(req, res) {
        try {
            const  {id}  = req.params;
            if (!id) {
                return res.status(400).json({ message: 'Не указан ID пользователя' });
            }
            const userId = parseInt(id, 10);
            if (isNaN(userId)) {
                return res.status(400).json({ message: 'ID пользователя должен быть числом' });
            }
            const userNews = await NewsUserServices.getUserNews(userId);
            res.json(userNews.rows);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Ошибка получения новостей пользователя' });
        }
    }
}

class NewsModerController {
    async setNewsStatus(req, res) {
        try {
            const { id } = req.params;
            const { isVerified } = req.body;

            if (typeof isVerified === 'undefined') {
                return res.status(400).json({ message: 'Статус isVerified не указан' });
            }

            const updatedNews = await NewsModerServices.setNewsStatus(id, isVerified);
            res.json(updatedNews);
        } catch (error) {
            console.error(error);
            res.status(error.status || 500).json({ message: error.message || 'Ошибка обновления статуса новости' });
        }
    }

    async getUnApprovedNews(req, res) {
        try {
            const unApprovedNews = await NewsModerServices.getUnApprovedNews();
            res.json(unApprovedNews.rows);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Ошибка получения неопубликованных новостей' });
        }
    }
}
class NewsAdminController {
    async createNewsTheme(req,res){
        try{
            const {themeName} = req.body;

            if (!themeName) {
                return res.status(400).json({ message: 'Имя темы не указано' });
            }

            const newTheme = await NewsService.createTheme(themeName);
            res.json({message:'Тема успешно добавлена',newTheme});
        }catch{
            console.error(error);
            res.status(500).json({ message: 'Ошибка добавления темы' });
        }
    }

    async deleteNewsTheme(req,res){
        try{
            const theme_id = req.params;

            if (!theme_id) {
                return res.status(400).json({ message: 'Id не указан' });
            }
            
            const newTheme = await NewsService.deleteTheme(id);
            res.json({message:'Тема успешно удалена',newTheme});
        }catch{
            console.error(error);
            res.status(500).json({ message: 'Ошибка удаления темы' });
        }
    }

    async deleteNews(req, res) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ message: 'Не указан ID новости' });
            }

            const deletedNews = await NewsService.deleteNews(id);
            res.json({ message: 'Новость успешно удалена', deletedNews });
        } catch (error) {
            console.error(error);
            res.status(error.status || 500).json({ message: error.message || 'Ошибка удаления новости' });
        }
    }
}

module.exports = {
    NewsController: new NewsController(),
    NewsUserController: new NewsUserController(),
    NewsModerController: new NewsModerController(),
    NewsAdminController: new NewsAdminController(),
};
