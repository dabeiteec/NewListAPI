const db = require('../db/db');

class NewsServices{
    async getAllNews() {
        return await db.query('SELECT * FROM news');
    }
}

class NewsUserServices {

    async createNews({ name, description, image, themeIds, authorId, isVerified }) {
        const newNews = await db.query(
            'INSERT INTO news (name, description, author_id, image, is_verified) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, description, authorId, image, isVerified || false]
        );

        const newsId = newNews.rows[0].id;

        const themePromises = themeIds.map((themeId) =>
            db.query('INSERT INTO news_theme (news_id, theme_id) VALUES ($1, $2)', [newsId, themeId])
        );
        await Promise.all(themePromises);

        return newNews.rows[0];
    }

    async updateNews({ id, name, description, image, themeIds }) {
        const updatedNews = await db.query(
            'UPDATE news SET name = $1, description = $2, image = $3 WHERE id = $4 RETURNING *',
            [name, description, image, id]
        );

        if (!updatedNews.rows.length) {
            throw { status: 404, message: 'Новость не найдена' };
        }

        await db.query('DELETE FROM news_theme WHERE news_id = $1', [id]);
        const themePromises = themeIds.map((themeId) =>
            db.query('INSERT INTO news_theme (news_id, theme_id) VALUES ($1, $2)', [id, themeId])
        );
        await Promise.all(themePromises);

        return updatedNews.rows[0];
    }

    async getUserNews(userId) {
        console.log(typeof(userId))
        return await db.query('SELECT * FROM news WHERE author_id = $1', [userId]);
    }

}
class NewsModerServices{
    async setNewsStatus(newsId, isVerified) {
        const updatedNews = await db.query(
            'UPDATE news SET is_verified = $1 WHERE id = $2 RETURNING *',
            [isVerified, newsId]
        );

        if (!updatedNews.rows.length) {
            throw { status: 404, message: 'Новость не найдена' };
        }

        return updatedNews.rows[0];
    }

    async getUnApprovedNews() {
        return await db.query('SELECT * FROM news WHERE is_verified = false');
    }
}

class NewsAdminServices{
    async createTheme(themeName) {
        const addTheme = await db.query('INSERT INTO theme (name) VALUES ($1) RETURNING *', [themeName]);

        if (!addTheme.rows.length) {
            throw { status: 404, message: 'Не удалось добавить тему' };
        }

        return addTheme.rows[0];
    }
    async deleteTheme(id){
        //TODO решить как удаляем новость по id или по нейму
    }
    async deleteNews(newsId) {
        const deletedNews = await db.query('DELETE FROM news WHERE id = $1 RETURNING *', [newsId]);

        if (!deletedNews.rows.length) {
            throw { status: 404, message: 'Новость не найдена' };
        }

        return deletedNews.rows[0];
    }
}


module.exports ={
    NewsServices: new NewsServices(),
    NewsUserServices: new NewsUserServices(),
    NewsModerServices: new NewsModerServices(),
    NewsAdminServices: new NewsAdminServices(),
};
