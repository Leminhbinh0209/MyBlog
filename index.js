const express = require('express');
app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require ('cookie-parser');

const config = require('./config/key');

const {User} = require('./models/user');
const {auth} = require('./middleware/auth')

mongoose.connect(config.mongoURI, {useNewUrlParser:true}).then(() => console.log("DB connected OK")).catch(err => {
    console.log(err)});

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cookieParser()); 


app.get("/api/user/auth", auth, (req, res) => {
    res.status(200).json({
        _id: req._id,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role
    })
})

app.post('/api/user/register', (req, res) => {
    const user = new User(req.body);

    user.save((err, doc) => {
        if (err) return res.json({success:false, err});
        return res.status(200).json({
            success: true,
            userData: doc
        });
    });
    
})

app.post('/api/user/login', (req, res)=>{
    // find the email
    User.findOne({email: req.body.email}, (err, user) => {
        if (!user){
            return res.json({
                success:true,
                massage: "Auth failed"
            })
        }
        // compare the password
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch){
                return res.json({
                    loginSuccess: false,
                    massaage: "Wrong password"
                })
            }
        })
        // generate a token
        user.generateToken((err, user) => {
            if(err) return res.status(400).send(err);
            res.cookie("x_auth", user.token).status(200).json({
                loginSuccess: true
            })
        })
    })
})

app.get("/api/user/logout", auth, (req, res) => {
    User.findByIdAndUpdate({_id: req.user._id}, {token: ""}, (err, doc)=>{
        if (err) return res.json({success: false, err});
        return res.status(200).send({
            success:true
        })
    })
})


app.get('/', (req, res) => {
    res.send("Hello world!");
});
const port = process.env.PORT || 5000;

app.listen(port, () =>{
    console.log("Server running at " + port)
});