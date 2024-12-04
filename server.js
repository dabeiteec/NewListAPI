const express = require('express');
const userRouter = require('./routes/user.router.js')
const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.json())
app.use('/api',userRouter)

const startServer = ()=>{
    try{
        app.listen(PORT,console.log(`сервер запущен на порту ${PORT}`));
    }
    catch(error){
        console.log(error)
    }
};
startServer();