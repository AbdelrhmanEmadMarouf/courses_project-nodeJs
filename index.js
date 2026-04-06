const express = require('express');
const app = express();
const {connectDB} = require('./confiq/DB');
let courseRouter = require('./routes/courses.routes');


const startServer = async () => {
    await connectDB();

    app.listen(5000, () => {
        console.log('port is listening on 5000');
    });
};



app.use(express.json()); //* tp parse request body into json
app.use('/api/courses',courseRouter);  


startServer();


