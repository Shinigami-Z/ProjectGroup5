var express = require('express');
var router = express.Router();
let userModel = require('../models/user');
let User = userModel.User;

router.get('/login',function(req,res,next){
  if(!req.user)
  {
    res.render('auth/login',
        {
          title:'Login',
          message: req.flash('loginMessage'),
          displayName: req.user ? req.user.displayName:''
        })
  }
  else{
    return res.redirect('/home')
  }
})
router.post('/login',function(req,res,next){
  passport.authenticate('local',function(err,User,info){
    // server error
    if(err)
    {
      return next(err);
    }
    // login error
    if(!User)
    {
      req.flash('loginMessage',
          'AuthenticationError');
      return res.redirect('/login')
    }
    req.login(User,(err)=>{
      if(err)
      {
        return next(err)
      }
      return res.redirect('/InventoryRT');
    })
  })(req,res,next)
})

router.get('/register',function(req,res,next){
  if(!req.user)
  {
    res.render('auth/register',
        {
          title:'Register',
          message: req.flash('registerMessage'),
          displayName: req.user ? req.user.displayName: ''
        })
  }
  else{
    return res.redirect('/home')
  }
})

router.post('/register', function(req,res,next){
  let newUser = new User({
    username: req.body.username,
    // password: req.body.password,
    email: req.body.email,
    displayName: req.body.displayName
  })
  User.register(newUser, req.body.password,(err) => {
    if(err)
    {
      console.log("Error in inserting new User");
      if(err.name =='UserExistError')
      {
        req.flash('registerMessage',
            'Registration Error : User already Exist'
        )}
      return res.render('auth/register',
          {
            title:'Register',
            message: req.flash('registerMessage'),
            displayName: req.user ? req.user.displayName:''
          })
    }
    else{
      return passport.authenticate('local')(req,res,()=>{
        res.redirect('/InventoryRT');
      })
    }
  })
})

router.get('/logout',function(req,res,next){
  req.logout(function(err){
    if(err)
    {
      return next(err);
    }
  })
  res.redirect('/home')
})
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'Home'  
  });
});

/* GET home page. */
router.get('/home', function(req, res, next) {
  res.render('index', { 
    title: 'Home'  
  });
});


/* GET About page. */
router.get('/about', function(req, res, next) {
  res.render('index', { 
    title: 'About Us'  
  });
});


/* GET Products page. */
router.get('/products', function(req, res, next) {
  res.render('../views/Products/list', {
    title: 'Products'  
  });
});

/* GET Services page. */
router.get('/services', function(req, res, next) {
  res.render('index', { 
    title: 'Services'  
  });
});

/* GET Contact page. */
router.get('/contactus', function(req, res, next) {
  res.render('index', {
    title: 'Contact'  
  });
});
module.exports = router;
