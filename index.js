require('dotenv').config() ;  
const express = require('express');
const app = express();
const {connectDB} = require('./confiq/DB');
let courseRouter = require('./routes/courses.routes');
const utils = require('./utils/utils');


const startServer = async () => {
    await connectDB();

    app.listen(process.env.SERVER_PORT, () => {
        console.log(`port is listening on ${process.env.SERVER_PORT}`);
    });
};


app.use(express.json()); //* tp parse request body into json
app.use('/api/courses',courseRouter);  

app.use((req,res,next)=>{
    res.status(utils.HTTP_STATUS.NOT_FOUND)
        .json({
            status : utils.STATUS_TEXT.ERROR,
            message : utils.MESSAGES.ROUTE_NOT_FOUND
        });
});

startServer();


