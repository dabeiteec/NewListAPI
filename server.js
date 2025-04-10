const express = require('express');
const userRouter = require('./routes/user.router.js');
const newsRouter = require('./routes/news.router.js');
const authRouter = require('./routes/auth.router.js')
const { initDB }= require('./db/initDb.js');
const PORT = process.env.PORT;

const app = express();

app.use((req, res, next) => {
    const now = new Date().toISOString();
    console.log(`[${now}] ${req.method} ${req.url} - From: ${req.ip}`);
    next();
});



app.use(express.json());
app.use('/api',[authRouter,userRouter, newsRouter]);

const startServer = async()=>{
    try{
        await initDB();
        const HOST = '0.0.0.0';
        app.listen(PORT, HOST, () => {
            console.log(`API is running at http://${HOST}:${PORT}`);
        });
    }
    catch(error){
        console.log(error)
    }
};
startServer();