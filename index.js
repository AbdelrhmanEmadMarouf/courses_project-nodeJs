const express = require('express');
const app = express();

app.listen(5000,()=>{
    console.log('port is listining on 5000');
});


const courses = [
    {
        id: 1,
        title: "js course",
        price: 1000
    },
    {
        id: 2,
        title: "react course",
        price: 1000
    }
]

app.get('/api/courses',(req,res)=>{
    res.json(courses);
})