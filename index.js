const express = require('express');
app = express();
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://minhbinhle:lmb02091996@myblog.jx0qh.mongodb.net/<dbname>?retryWrites=true&w=majority', {useNewUrlParser:true}).then(() => console.log("DB connected OK")).catch(err => console.log(err));

app.get('/', (req, res) => {
    res.send("Hello world");
});
app.listen(5000, () =>{
    console.log("Server running at port 5000")
});