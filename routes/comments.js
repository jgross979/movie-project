var express = require("express");
var router = express.Router();
var Movie = require("../models/movies");
var Comment = require("../models/comments");
var middleware = require('../middleware')

//==============   
//COMMENT ROUTES
//==============
//Comment new
router.get('/movies/:id/comments/new', middleware.isLoggedIn,  function(req,res){
    Movie.findById(req.params.id, function(err, foundMovie){
        if(err || !foundMovie){
            req.flash('error', 'Movie not found')
            console.log(err)
        }else{
            res.render('comments/new', {movie:foundMovie});
        }
    })
});

//Comment create
router.post('/movies/:id/comments', middleware.isLoggedIn, function(req, res){
    let newComment = req.body.comment
    Movie.findById(req.params.id, function(err, foundMovie){
        if(err || !foundMovie){
            req.flash('error', 'Movie not found')
            console.log(err)
            return res.redirect('back')
        }else{
            Comment.create(newComment, function(err, comment){
                if(err){
                    req.flash('error', err.message)
                    console.log(err)
                }else{
                    //save username to specific comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    //save comment to specific movie
                    foundMovie.comments.push(comment);
                    foundMovie.save()
                    req.flash('success', 'Comment created!')
                    res.redirect('/movies/'+req.params.id)
                }
            })
        }
    })
})


//comment edit
router.get('/movies/:id/comments/:comment_id/edit', middleware.checkCommentOwnership, function(req, res){
    var movie_id = req.params.id
    Movie.findById(movie_id, function(err, foundMovie) {
        if(err || !foundMovie){
            req.flash('error', 'Movie not found')
            return res.redirect('back')
        }else{
            Comment.findById(req.params.comment_id, function(err, foundComment){
                if(err){
                    req.flash('error', err.message)
                    console.log(err)
                }else{
                    res.render('comments/edit', {comment:foundComment, movie_id: movie_id})
                }
            });
        }
    })
});


//comment update

router.put('/movies/:id/comments/:comment_id', middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            console.log(err)
        }else{
            res.redirect('/movies/'+req.params.id)
        }
    } )
})


//comment delete

router.delete('/movies/:id/comments/:comment_id', middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err, deletedComment){
        if(err){
            console.log(err)
        }else{
            req.flash('success', 'Comment deleted!')
            res.redirect('/movies/'+req.params.id)           
        }
    })
})


module.exports = router;
