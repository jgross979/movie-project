var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require('../models/users');
var Movie = require('../models/movies');
var middleware = require('../middleware')



//============
//USER ROUTES
//============
//User Index
router.get('/users', function(req, res){
    User.find({}, function(err, users){
        if(err ||!users){
            req.flash('error', 'Could not find users')
            console.log(err)
        }else{
            res.render('users/index', {users:users})
        }
    })
})

//User Show
router.get('/users/:id', function(req,res){
    User.findById(req.params.id, function(err, foundUser){
        if(err || !foundUser){
            req.flash('error', 'User not found')
        }else{
            Movie.find().where('author.id').equals(foundUser._id).exec(function(err, movies){
                if(err){
                    console.log(err)
                }else{
                    res.render('users/show', {user:foundUser, movies:movies})
                }
            })
        }
    })
})

//User Edit
router.get('/users/:id/edit', middleware.checkUserOwnership, function(req, res){
    User.findById(req.params.id, function(err, foundUser){
        if(err || !foundUser){
            req.flash('error', 'User not found')
        }else{
            Movie.find().where('author.id').equals(foundUser._id).exec(function(err, movies){
                if(err){
                    console.log(err)
                }else{
                    res.render('users/edit', {user:foundUser, movies:movies})
                }
            })
        }
    })
})

//User Update

router.put('/users/:id', middleware.checkUserOwnership, function(req, res){
    User.findByIdAndUpdate(req.params.id, req.body.user, function(err, updatedUser){
        if(err || !updatedUser){
            req.flash('error', 'User not found')
            console.log(err)
        }else{
            req.flash('success', 'Profile successfully updated!')
            res.redirect('/users/' + updatedUser._id)
        }
    })
})

//==============
//AUTHENTICATION
//==============

//render sign-up form
router.get("/register", function(req, res){
    res.render('register')
})

//registration logic
router.post("/register", function(req, res){
    let newUser = new User({username: req.body.username})
    if(req.body.password !== req.body.confirm_password){
            req.flash('error', 'Passwords must match')
            return res.redirect('/register')
        }else{
            User.register(newUser, req.body.password, function(err, user){
                if(err){
                    req.flash('error', err.message)
                    return res.redirect('/register')
                }else{
                    passport.authenticate('local')(req, res, function(){
                        req.flash('success', 'Welcome to MovieSaver ' + user.username + '!')
                        res.redirect('/movies')
                    })
                }
            })
        }

})

//render login form
router.get('/login', function(req, res) {
    res.render('login')
})

//login logic
router.post('/login', passport.authenticate('local', {
    successRedirect: '/movies',
    failureRedirect: '/login'
}), function(req, res){
})

//logout
router.get('/logout', function(req, res){
    req.logout();
    req.flash('success', 'You have successfully logget out!')
    res.redirect('/movies')
})


module.exports = router;