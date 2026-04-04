const express = require('express');
const app = express();



app.listen(5000,()=>{
    console.log('port is listining on 5000');
});

app.use(express.json()); //* tp parse request body into json

let courseRouter = require('./routes/courses.routes');


app.use('/api/courses',courseRouter);  
