let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
var router = express.Router();

let app = express();
let session = require('express-session');
let passport = require('passport');
let passportLocal = require('passport-local');
let localStrategy = passportLocal.Strategy;
let flash = require('connect-flash');

// create a user model instance
let userModel = require('../models/user');
let User = userModel.User;

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../../public')));
app.use(express.static(path.join(__dirname, '../../node_modules')));

let mongoose = require('mongoose');
let mongoDB = mongoose.connection;
let DB = require('./db');
//mongoose.connect('mongodb://127.0.0.1:27017/Assignments');
mongoose.connect(DB.URI);
mongoDB.on('error',console.error.bind(console,'Connection Error'));
mongoDB.once('open',()=>{console.log("Mongo DB is connected")});
//mongoose.connect(DB.URI);

// Set-up Express-Session
app.use(session({
  secret:"SomeSecret",
  saveUninitialized:false,
  resave:false
}));

// initialize flash-connect
app.use(flash());

// implement a user authentication
passport.use(User.createStrategy());

// Serialize and Deserialize user information
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// initialize the passport
app.use(passport.initialize());
app.use(passport.session());

//GitHub login
const GitHubStrategy = require('passport-github2').Strategy;

passport.use(new GitHubStrategy({
      clientID: 'bb2e411f39e1de1b3880',
      clientSecret: '0117d82b35f2e1544091ea5b3c5d39f590404067',
      callbackURL: 'https://the-inventory-hub.onrender.com/auth/github/callback'
    },
    async function(accessToken, refreshToken, profile, done) {
      try {
        let user = await User.findOne({ githubId: profile.id });
        if (!user) {
          // User not found, create a new user
          user = new User({
            githubId: profile.id,
            username: profile.username,
            displayName: profile.displayName,
            email: profile.emails?.[0]?.value || 'No email provided' // Use optional chaining request the 'user:email' scope
          });
          await user.save();
        }
        done(null, user);
      } catch (err) {
        done(err);
      }
    }
));

//Google login
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
      clientID: '217310531201-p7ut0gq1t72pm46vl1hq3md9uu1294et.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'https://the-inventory-hub.onrender.com/auth/google/callback'
    },
    async function(accessToken, refreshToken, profile, done) {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          // User not found, create a new user
          user = new User({
            googleId: profile.id,
            username: profile.username || profile.displayName, // Adjust according to available data
            displayName: profile.displayName,
            email: profile.emails[0].value, // Assuming the email is available
          });
          await user.save();
        }
        done(null, user);
      } catch (err) {
        done(err);
      }
    }
));

// Discord Login
const DiscordStrategy = require('passport-discord').Strategy;

passport.use(new DiscordStrategy({
        clientID: '1182473778664591530',
        clientSecret: 'g2wJgNi3_uTZtzMzN4KFVdv-1X7SLPtp',
        callbackURL: 'https://the-inventory-hub.onrender.com/auth/discord/callback',
        scope: ['identify', 'email'] // Adjust the scope according to your needs
    },
    async function(accessToken, refreshToken, profile, done) {
        try {
            let user = await User.findOne({ discordId: profile.id });
            if (!user) {
                // User not found, create a new user
                user = new User({
                    discordId: profile.id,
                    username: profile.username, // Discord username
                    displayName: profile.username, // Discord display name
                    email: profile.emails?.[0]?.value || 'No email provided' // Email, if available
                });
                await user.save();
            }
            done(null, user);
        } catch (err) {
            done(err);
        }
    }
));

let indexRouter = require('../routes/index');
let usersRouter = require('../routes/users');
let InventoryRTRouter = require('../routes/InventoryRT');

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/InventoryRT', InventoryRTRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error',{title:'Error'});
});

module.exports = app;
