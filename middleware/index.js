let Comment = require('../models/comments');
let Movie = require('../models/movies');
let User = require('../models/users');

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }else{
        req.flash('error', 'You need to be logged in to do that')
        return res.redirect('/login')
        }
    }
    
function checkCommentOwnership(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if(err || !foundComment){
                req.flash('error', 'Comment not found')
                return res.redirect('back')
            }else{
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash('error', 'You do not have permission to do that')
                    return res.redirect('back')
                }
            }
        })
    }else{
        req.flash('error', 'You need to be logged in to do that')
        return res.redirect('back')
    }
}

function checkMovieOwnership(req, res, next){
    if(req.isAuthenticated()){
        Movie.findById(req.params.id, function(err, foundMovie){
            if(err || !foundMovie){
                req.flash('error', 'Movie could not be found')
                return res.redirect("back")
            }else{
                if(foundMovie.author.id.equals(req.user._id)){
                    next();   
                }else{
                    req.flash('error', 'You do not have permission to do that')
                    return res.redirect("back")
            }
        }
    });
    }else{
        req.flash('error', 'You must be logged in to do that')
        return res.redirect("back")
    }
}

function checkUserOwnership(req, res, next){
    if(req.isAuthenticated()){
        User.findById(req.params.id, function(err, foundUser){
            if(err || !foundUser){
                req.flash('error', 'User not found')
                return res.redirect("back")
            }else{
                if(foundUser._id.equals(req.user._id)){
                    next();   
                }else{
                    req.flash('error', 'You do not have permission to do that')
                    return res.redirect("back")
                }
            
            }
    });
    }else{
        req.flash('error', 'You must be logged in to do that')
        return res.redirect("back")
    }
}



let middleware = (function(){
    return{
        isLoggedIn: isLoggedIn,
        checkMovieOwnership: checkMovieOwnership,
        checkCommentOwnership: checkCommentOwnership,
        checkUserOwnership: checkUserOwnership
    }
})()

module.exports = middleware