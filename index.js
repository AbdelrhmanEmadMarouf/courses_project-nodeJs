require('dotenv').config() ;  
const express = require('express');
const app = express();
const {connectDB} = require('./confiq/DB');
let courseRouter = require('./routes/courses.routes');
const utils = require('./utils/utils');
const cors = require('cors')


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

app.use((req,res,next)=>{
    res.status(utils.HTTP_STATUS.NOT_FOUND)  
        .json({
            status : utils.STATUS_TEXT.ERROR,
            message : utils.MESSAGES.ROUTE_NOT_FOUND
        });
});

startServer();


