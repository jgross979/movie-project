const expressSanitizer = require("express-sanitizer"),
      methodOverride   = require("method-override"),
      bodyParser       = require("body-parser"),
      mongoose         = require("mongoose"), 
      passport         = require("passport"),
      LocalStrategy    = require("passport-local"),
      express          = require("express"),
      flash            = require('connect-flash'),
      app              = express(),
      Movie            = require("./models/movies"),
      Comment          = require("./models/comments"),
      User             = require("./models/users")
      

//Routes      
var commentRoutes = require('./routes/comments')
var movieRoutes = require('./routes/movies')
var indexRoutes = require('./routes/index')
      
//APP CONFIG
    mongoose.connect('mongodb://localhost/movie_app')
      app.set("view engine", "ejs")
      app.use(express.static("public"));
      app.use(bodyParser.urlencoded({extended:true}));
      app.use(expressSanitizer());
      app.use(methodOverride("_method"));
      app.use(flash());
      
//PASSPORT CONFIGURATION
    app.use(require("express-session")({
        secret: "secret message that I will change when not seen but the public",
        resave: false,
        saveUninitialized: false
    }));
    
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new LocalStrategy(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());
    
    app.use(function(req, res, next){
        res.locals.currentUser = req.user;
        res.locals.error = req.flash('error');
        res.locals.success = req.flash('success');
        next();
    })
    
//Use Routes
app.use('/movies', movieRoutes);
app.use(commentRoutes);
app.use(indexRoutes);
    

//LOCALHOST
app.listen(process.env.PORT, process.env.IP, function(){
    console.log('server is running!')
});     
      