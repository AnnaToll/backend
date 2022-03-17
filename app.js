const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/user');

const app = express();

const dbURI = process.env.DATABAS;

mongoose.connect(dbURI)
 .then(() => {
    console.log('connected to db');
    app.listen(3002);
 })
 .catch((err) => {
     console.log(err);
 })

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/api', (req, res) => {
    User.find()
        .then((result) => {
            res.send(result);
        })
        .catch(err => console.log(err));
})


app.post('/api/login', (req, res) => {

    let isEmailRegistered = false;
    let doEmailAndPasswordMatch = false;
    let userObject = {};

    User.find()
        .then((result) => {
            for(let user of result) {
                if (user.email === req.body.email) {
                    isEmailRegistered = true;
                    if (user.password === req.body.password) {
                        doEmailAndPasswordMatch = true;
                        userObject = user;
                        break;
                    }
                }
            }

            let userResponseObject = {
                "user": userObject,
                "status": {
                    "isRegistered": isEmailRegistered,
                    "match": doEmailAndPasswordMatch
                }
            };

            res.send(userResponseObject);
        })
        .catch(err => console.log(err));
})


app.post('/api/create-account', (req, res) => {

    let isEmailRegistered = false;

    User.find()
        .then((result) => {
            
            for(let user of result) {
                if (user.email === req.body.email) {
                    isEmailRegistered = true;
                    break;
                }
            }
            res.send({ alreadyRegistred: isEmailRegistered })
        })
        .then(() => {

            if (!isEmailRegistered) {
                const newUser = new User(req.body);       
                newUser.save()
                    .catch(err => console.log(err));
            }
        })
        .catch(err => console.log(err));    

})

app.get('/api/logged-in/:id', (req, res) => {

    const id = req.params.id;
    console.log(id);

    User.findById(id)
        .then((data) => {
            res.send(data);
        })

})