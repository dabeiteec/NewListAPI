const express = require('express');
const userRouter = require('./routes/user.router.js')
const newsRouter = require('./routes/news.router.js')
const PORT = process.env.PORT;

const app = express();
app.use((req, res, next) => {
    const now = new Date().toISOString();
    console.log(`[${now}] ${req.method} ${req.url} - From: ${req.ip}`);
    next();
});



app.use(express.json());
app.use('/api',[userRouter, newsRouter]);
// app.use('/api',newsRouter);

const startServer = ()=>{
    try{
        //
        const HOST = '0.0.0.0';
        app.listen(PORT, HOST, () => {
            console.log(`API is running at http://${HOST}:${PORT}`);
        });
        //
        // app.listen(PORT,console.log(`сервер запущен на порту ${PORT}`));
    }
    catch(error){
        console.log(error)
    }
};
startServer();