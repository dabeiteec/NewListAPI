const { pool } = require('../db/initDb');

class NewsServices {
    async getAllNews() {
        try {
            const result = await pool.query('SELECT * FROM news WHERE status = $1', ['approved']);
            return result.rows;
        } catch (error) {
            console.error('Ошибка при получении всех новостей', error);
            throw { status: 500, message: 'Ошибка при получении всех новостей' };
        }
    }
    
    async getNewsForTheme(theme) {
        try {
            const result = await pool.query(
                `SELECT n.* FROM news n
                JOIN news_theme nt ON n.id = nt.news_id
                JOIN theme t ON nt.theme_id = t.id
                WHERE t.name = $1 AND n.status = 'approved'`, [theme]
            );
            return result.rows;
        } catch (error) {
            console.error('Ошибка при получении новостей по теме', error);
            throw { status: 500, message: 'Ошибка при получении новостей по теме' };
        }
    }
}


class NewsUserServices {

    async createNews({ name, description, image, themeIds, authorId, authorRole }) {
        const status = authorRole === 'admin' ? 'approved' : 'unapproved';
    
        try {
            const newNews = await pool.query(
                'INSERT INTO news (name, description, author_id, image, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                [name, description, authorId, image, status]
            );
    
            const newsId = newNews.rows[0].id;
    
            const themePromises = themeIds.map((themeId) =>
                pool.query('INSERT INTO news_theme (news_id, theme_id) VALUES ($1, $2)', [newsId, themeId])
            );
            await Promise.all(themePromises);
    
            return newNews.rows[0];
        } catch (error) {
            console.error('Ошибка при создании новости:', error);
            throw { status: 500, message: 'Ошибка при создании новости' };
        }
    }
    

    async updateNews({ news_id, name, description, image, themeIds, authorId, authorRole }) {
        const existingNews = await pool.query('SELECT * FROM news WHERE id = $1', [news_id]);
    
        if (!existingNews.rows.length) {
            throw { status: 404, message: 'Новость не найдена' };
        }
    
        const news = existingNews.rows[0];
    
        if (authorRole !== 'admin' && news.author_id !== authorId) {
            throw { status: 403, message: 'Нет прав на редактирование этой новости' };
        }
    
        const updatedNews = await pool.query(
            'UPDATE news SET name = $1, description = $2, image = $3 WHERE id = $4 RETURNING *',
            [name, description, image, news_id]
        );
    
        await pool.query('DELETE FROM news_theme WHERE news_id = $1', [news_id]);
        const themePromises = themeIds.map((themeId) =>
            pool.query('INSERT INTO news_theme (news_id, theme_id) VALUES ($1, $2)', [news_id, themeId])
        );
        await Promise.all(themePromises);
    
        const themes = await pool.query('SELECT theme_id FROM news_theme WHERE news_id = $1', [news_id]);
        const themeIdArray = themes.rows.map(row => row.theme_id);
    
        return {
            ...updatedNews.rows[0],
            themeIds: themeIdArray
        };
    }
    
    
    async getUserNews(userId) {
        try {
            const userCheck = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    
            if (!userCheck.rows.length) {
                throw { status: 404, message: 'Пользователь не найден' };
            }
    
            const result = await pool.query('SELECT * FROM news WHERE author_id = $1', [userId]);
            return result;
        } catch (error) {
            console.error('Ошибка при получении новостей пользователя:', error);
            throw { status: error.status || 500, message: error.message || 'Ошибка при получении новостей пользователя' };
        }
    }
}
class NewsModerServices{
    async getUnApprovedNews() {
        try{
            return await pool.query("SELECT * FROM news WHERE status = 'unapproved'");
        }catch (error) {
            console.error('Ошибка при получении неподтвержденных новостей:', error);
            throw { status: 500, message: 'Ошибка при получении неподтвержденных новостей' };
        }
    }
    async setNewsStatus(newsId, status) {
        const updatedNews = await pool.query(
            'UPDATE news SET status = $1 WHERE id = $2 RETURNING *', 
            [status, newsId]
        );
    
        if (!updatedNews.rows.length) {
            throw { status: 404, message: 'Новость не найдена' };
        }
    
        return updatedNews.rows[0];
    }
    
}
class NewsAdminServices{
    async createTheme(themeName) {
        try {
            const addTheme = await pool.query('INSERT INTO theme (name) VALUES ($1) RETURNING *', [themeName]);
    
            if (!addTheme.rows.length) {
                throw { status: 404, message: 'Не удалось добавить тему' };  
            }

            return addTheme.rows[0];  
        } catch (error) {  
            console.error('Ошибка при добавлении темы в базу данных:', error);
            throw error;  
        }
    }
    
    async deleteTheme(theme_id) {
    try {
        const deleteTheme = await pool.query(
            'DELETE FROM theme WHERE id = $1 RETURNING *', 
            [theme_id]
        );

        if (deleteTheme.rows.length === 0) {
            throw { status: 404, message: 'Тема с таким id не найдена' };
        }

        return deleteTheme.rows[0]; 
    } catch (error) { 
        console.error('Ошибка при удалении темы:', error);
        throw error;  
    }
}

    async deleteNews(newsId) {
        const deletedNews = await pool.query('DELETE FROM news WHERE id = $1 RETURNING *', [newsId]);

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
