const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
// const Auth = require('./routes/auth')

const bcrypt = require("bcrypt");
const bcryptSalt = 10;

// const isBoss = req.body.role === 'Boss'

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    console.log(req.isAuthenticated())
    return next();
  } else {
    res.redirect('/auth/login')
  }
}

router.get('/adduser', ensureAuthenticated, (req, res, next) => {
  User.find()
    .then(users => {
      res.render('auth/adduser', {
        users
      });
    })
});

router.post('/adduser', (req, res, next) => {
  username = req.body.username;
  role = req.body.role;
  console.log(req.user)
  if (req.user.role === 'Boss') {
    User.findOneAndUpdate({
        username: username
      }, {
        role: role
      })
      .then(() => {
        res.redirect('/room/adduser')
      })
  } else {
    console.log("You're not the boss")
    res.render('/auth/adduser',{message:"You're not the boss"})
    
    next()
  }
})
router.post('/createuser', (req, res, next) => {
  username = req.body.username;
  role = req.body.role;
  password = 'new'
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  if (req.user.role === 'Boss') {
    User.create({
        username: username,
        password: hashPass,
        role: role
      })
      .then(() => {
        res.redirect('/room/adduser')
      })
  } else {
    console.log("You're not the boss")
    res.render('/auth/adduser',{message:"You're not the boss"})
    
    next()
  }
})

router.get('/profile/:id', (req,res,next)=>{
  id = req.params.id;
  User.findById(id)
  .then(user =>{
    res.render('auth/profile', {user})

  })
})

router.get('/profile/:id/delete', (req,res,next)=>{
  id = req.params.id;
  User.findByIdAndDelete(id)
  .then(user =>{
    res.render('auth/profile', {user})

  })
})




module.exports = router