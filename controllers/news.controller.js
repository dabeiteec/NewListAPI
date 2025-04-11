const { NewsServices, NewsUserServices, NewsModerServices,NewsAdminServices } = require('../services/news.services');

class NewsController {
    async getAllNews(req, res) {
        try {
            const news = await NewsServices.getAllNews();
            res.status(200).json(news);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Ошибка получения новостей' });
        }
    }
    async getNewsForTheme(req, res) {
        try{
            const { theme } = req.body;
            if (!theme) {
                return res.status(400).json({ message: 'Не указана тема' });
            }
            const news = await NewsServices.getNewsForTheme(theme);
            res.json(news);
        }catch(error){
            console.error(error);
            res.status(500).json({ message: 'Ошибка получения новостей по теме' });
        }
    }
}

class NewsUserController {
    async createNews(req, res) {
        try {
            const { name, description, image, themeIds } = req.body;
            const authorId = req.user.id;
            const authorRole = req.user.role;

            if (!name || !description || !themeIds?.length) {
                throw {status:400,message: 'Заполните обязательные поля: name, description, themeIds' };
            }
    
            const newNews = await NewsUserServices.createNews({
                name, description, image, themeIds, authorId, authorRole
            });
    
            res.status(201).json({
                message: 'Новость успешно создана!',
                news: newNews
            });
        } catch (error) {
            console.error(error);
            res.status(error.status || 500).json({ message: error.message || 'Ошибка при создании новости' });
        }
    }
    

    async updateNews(req, res) {
        try {
            const authorId = req.user.id;
            const authorRole = req.user.role; 
            const { news_id, name, description, image, themeIds } = req.body;
    
            if (!news_id || !name || !description || !themeIds?.length) {
                throw({ status:400,message: 'Заполните обязательные поля: news_id, name, description, themeIds' });
            }
    
            const updatedNews = await NewsUserServices.updateNews({
                news_id,name,description,image,themeIds,authorId,authorRole
            });
    
            res.json({ message: 'Новость обновлена', updatedNews });
        } catch (error) {
            console.error(error);
            res.status(error.status || 500).json({ message: error.message || 'Ошибка обновления новости' });
        }
    }
    

    async getUserNews(req, res) {
        try {
            const  {id}  = req.params;
            if (!id) {
                throw ({status:400, message: 'Не указан ID пользователя' });
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
    async getUnApprovedNews(req, res) {
        try {
            const unApprovedNews = await NewsModerServices.getUnApprovedNews();
            res.json(unApprovedNews.rows);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Ошибка получения неопубликованных новостей' });
        }
    }
    async setNewsStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            if (! status) {
                return res.status(400).json({ message: 'Статус не указан' });
            }

            const validStatuses = ['approved', 'unapproved', 'rejected'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({ message: 'Неверный статус. Возможные статусы: approved, unapproved, rejected.' });
            }

            const updatedNews = await NewsModerServices.setNewsStatus(id, status);
            res.json(updatedNews);
        } catch (error) {
            console.error(error);
            res.status(error.status || 500).json({ message: error.message || 'Ошибка обновления статуса новости' });
        }
    }
}
class NewsAdminController {
    async createNewsTheme(req,res){
        try{
            const {themeName} = req.body;

            if (!themeName) {
                throw ({ status:400, message:'Имя темы не указано'}) ;
            }
            
            const newTheme = await NewsAdminServices.createTheme(themeName);
            res.json({message:'Тема успешно добавлена',newTheme});
        }catch(error){
            console.error(error);
            res.status(500).json({ message: 'Ошибка добавления темы' });
        }
    }

    async deleteNewsTheme(req, res) {
        try {
            const { id } = req.params; 
    
            if (!id) {
                return res.status(400).json({ message: 'Id не указан' });
            }
    
            const deletedTheme = await NewsAdminServices.deleteTheme(id);
            
            res.status(200).json({
                message: 'Тема успешно удалена',
                deletedTheme
            });
        } catch (error) { 
            console.error(error);
            res.status(error.status || 500).json({ message: error.message || 'Ошибка удаления темы' });
        }
    }
    

    async deleteNews(req, res) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ message: 'Не указан ID новости' });
            }

            const deletedNews = await NewsAdminServices.deleteNews(id);
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
