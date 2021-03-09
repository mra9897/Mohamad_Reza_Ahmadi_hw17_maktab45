const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const api = require('./routes/api');

const app = express();

//connect to database
mongoose.connect(
    "mongodb://localhost:27017/company",{
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);

// configuration
app
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .use(express.json())
    .use(express.urlencoded({extended: false}))
    .use(express.static(path.join(__dirname, 'public')));

app.use('/', api);

// response 404 for not found requests
app.use((req, res)=>{
    res.render("404");
});

app.listen(5002, ()=>console.log("app is running on port 5002"));