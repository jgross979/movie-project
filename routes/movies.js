var express = require("express");
var router = express.Router();
var Movie = require("../models/movies");
var User = require("../models/users");
var middleware = require('../middleware');

//MOVIE ROUTES
//Index
router.get('/', function(req, res){
    if(req.user){
    Movie.find({}, function(err, movies){
        if(err){
            console.log(err)
        }else{
            Movie.find().where('author.id').equals(req.user._id).exec(function(err, foundMovies){
                if(err){
                    console.log(err)
                }else{
                    res.render('movies/index', {movies:foundMovies});
                }
            })
        }
    })
    }else{
        res.render('movies/index', {movies: undefined});
        }

})

//New
router.get('/new', middleware.isLoggedIn, function(req, res){
    res.render('movies/new');
})
//Create
router.post('/', middleware.isLoggedIn, function(req, res){
    let title = req.body.movie.title,
    img = req.body.movie.image,
    rtg = req.body.movie.rating,
    rvw = req.body.movie.review,
    author = {
        id: req.user._id,
        username: req.user.username
    },
    newMovie = {
        title: title,
        image: img,
        rating: rtg,
        review: rvw,
        author: author
    }
   
    Movie.create(newMovie, function(err, movie){
        if(err){
            console.log(err)
        }else{
            req.flash('success', 'New movie created!')
            res.redirect('/movies/' + movie._id)
        }
    })
});
//Show
router.get('/:id', function(req, res){
    Movie.findById(req.params.id).populate("comments").exec(function(err, foundMovie){
        if(err){
            console.log(err);
        }else{
            res.render('movies/show', {movie:foundMovie});
        }
    });
})

//Edit
router.get('/:id/edit', middleware.checkMovieOwnership, function(req, res){
    Movie.findById(req.params.id, function(err, foundMovie){
        if(err || !foundMovie){
            req.flash('error', 'Movie not found')
            return res.redirect('back')
        }
        res.render('movies/edit', {movie:foundMovie}) 
    });
});
//Update
router.put('/:id', middleware.checkMovieOwnership, function(req, res){
        Movie.findByIdAndUpdate(req.params.id, req.body.movie, function(err, updatedMovie){
            if(err || !updatedMovie){
                req.flash('error', 'Movie not found')
                console.log(err)
            }else{
                res.redirect('/movies')
            }
        })
});
//Delete
router.delete('/:id', middleware.checkMovieOwnership, function(req, res){
        Movie.findByIdAndRemove(req.params.id, function(err, deletedMovie){
            if(err || ! deletedMovie){
                req.flash('error', 'Movie not found')
                console.log(err)
            }else{
                req.flash('success', 'Movie successfully deleted')
                res.redirect('back')
            }

        })
});
    


module.exports = router;
 