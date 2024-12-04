const db = require('../db/db')

class NewsController{
    async getAllNews(req,res){
        const news = await db.query('SELECT * FROM news');
        res.json(news.rows);
    }
}
class NewsUserController{
    async createNews(req,res){
        //добавление роли со статусом одобрено(добавить выборку, если новость добавляет админ то сразу одобрено)

    }
    async updateNews(req,res){
        const {id,name,password} = req.body
        const user = await db.query(
            'UPDATE users SET name = $1, password = $2 WHERE id = $3 RETURNING *',
            [name,password,id]
        )
        res.json(user.rows[0]);
    }
    async getUserNews(req,res){

    }
}
class NewsModerController{
    async setNewsStatus(){

    }
    async getUnApprovedNews(){

    }
}
class NewsAdminController{
    async deleteNews(req,res){
        //!УДАЛЕНИЕ НОВОСТИ (ПО ID),  
    }
    async changeNews(req,res){
        //ИЗМЕНЕНИЕ НОВОСТИ (СО СТАТУСОМ "ОДОБРЕНО"),  
    }
}
module.exports = {
    NewsController: new NewsController(),
    NewsUserController: new NewsUserController(),
    NewsModerController: new NewsModerController(),
    NewsAdminController: new NewsAdminController(),
};