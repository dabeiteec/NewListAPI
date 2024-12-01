

class NewsController{
    async GetAllNews(req,res){
        const news = await db.query('SELECT * FROM news');
        res.json(news.rows);
    }
    async updateNews(req,res){
        const {id,name,password} = req.body
        const user = await db.query(
            'UPDATE users SET name = $1, password = $2 WHERE id = $3 RETURNING *',
            [name,password,id]
        )
        res.json(user.rows[0]);
    }
}