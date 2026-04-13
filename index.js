require('dotenv').config() ;  
const express = require('express');
const app = express();
const {connectDB} = require('./confiq/DB');
let courseRouter = require('./routes/courses.routes');
const userRouter = require('./routes/users.routs');
const authRouter = require('./routes/auth.routes');
const utils = require('./utils/utils');
const cors = require('cors')
const path = require('path');


var corsOptions = {
    origin:  'http://127.0.0.1:5500',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

const startServer = async () => {
    await connectDB();

    app.listen(process.env.SERVER_PORT || 4000, () => {
        console.log(`port is listening on ${process.env.SERVER_PORT}`);
    });
};


app.use(express.json()); //* tp parse request body into json

app.use('/api/courses',cors(corsOptions),courseRouter);  
app.use('/api/users',cors(corsOptions),userRouter);  
app.use('/api/auth',cors(corsOptions), authRouter);
app.use('/uploads/',express.static(path.join(__dirname,'uploads')));



//globaler middle ware for not found routes
app.use((req,res,next)=>{
    res.status(utils.HTTP_STATUS.NOT_FOUND)  
        .json({
            status : utils.STATUS_TEXT.ERROR,
            message : utils.MESSAGES.ROUTE_NOT_FOUND
        });
});

// global middleware for error handler
app.use((err,req,res,next)=>{
        res.status(err.statusCode || utils.HTTP_STATUS.INTERNAL_SERVER_ERROR)  
        .json({
            status : err.statusMessage ||utils.STATUS_TEXT.ERROR,
            message : err.message,
            code : err.statusCode || utils.HTTP_STATUS.INTERNAL_SERVER_ERROR
        });
})

startServer();

