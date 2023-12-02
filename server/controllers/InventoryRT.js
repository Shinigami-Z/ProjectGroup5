var express = require('express');
var router = express.Router();
//const { router } = require('../config/app');
let Products = require('../models/InventoryRT');

module.exports.DisplayInventoryRT = async (req, res, next)=>{ //< Mark function as async
    try{
        const InventoryRT = await Products.find(); //< Use of await keyword
        res.render('Products/list', {
            title: 'InventoryRT',
            InventoryRT: InventoryRT,
            DisplayName: req.user ? req.user.DisplayName: ''
        });
    }catch(err){
        console.error(err);
        //Handle error
        res.render('Products/list', {
            error: 'Error on server'
        });
    }
};

module.exports.AddProducts = async (req, res, next)=>{
    try{
        res.render('Products/add',
            {
                title:'Add Products',
                DisplayName: req.user ? req.user.DisplayName: ''
            })
    }
    catch(err)
    {
        console.error(err);
        res.render('Products/list',
            {
                error: 'Error on the server'
            });
    }
};

module.exports.CreateProducts = async (req, res, next)=>{
    try{
        let newProducts = Products({
            "ItemName":req.body.ItemName,
            "NumOfUnits": req.body.NumOfUnits,
            "PricePerUnit": req.body.PricePerUnit,
            "TotalValue":req.body.TotalValue
        });
        Products.create(newProducts).then(() =>{
            res.redirect('/InventoryRT')
        })
    }
    catch(error){
        console.error(err);
        res.render('Products/list',
            {
                error: 'Error on the server'
            });
    }
};
    
module.exports.EditProducts = async (req, res, next)=>{
    try{
        const id = req.params.id;
        const ProductsToEdit = await Products.findById(id);
        res.render('Products/edit',
            {
                title:'Edit Products',
                Products:ProductsToEdit,
                DisplayName: req.user ? req.user.DisplayName: ''
            })
    }
    catch(error){
        console.error(err);
        res.render('Products/list',
            {
                error: 'Error on the server'
            });
    }
}

module.exports.ProcessEditProducts = (req, res, next)=>{
    try{
        const id = req.params.id;
        let updatedProducts = Products({
            "_id":id,
            "ItemName":req.body.ItemName,
            "NumOfUnits": req.body.NumOfUnits,
            "PricePerUnit": req.body.PricePerUnit,
            "TotalValue":req.body.TotalValue
        });
        Products.findByIdAndUpdate(id,updatedProducts).then(()=>{
            res.redirect('/InventoryRT')
        });
    }
    catch(error){
        console.error(err);
        res.render('Products/list',
            {
                error: 'Error on the server'
            });
    }
}

module.exports.DeleteProducts = (req, res, next)=>{
    try{
        let id = req.params.id;
        Products.deleteOne({_id:id}).then(() =>
        {
            res.redirect('/InventoryRT')
        })
    }
    catch(error){
        console.error(err);
        res.render('Products/list',
            {
                error: 'Error on the server'
            });
    }
}
module.exports.DisplayLoginPage = (req, res, next)=>{
    if(!req.user)
    {
        res.render('auth/login',
            {
                title:'Login',
                message: req.flash('loginMessage'),
                DisplayName: req.user ? req.user.DisplayName: ''
            });
    }
    else
    {
        return res.redirect('/')
    }
}
module.exports.ProccessLoginPage = (req, res, next)=>{
    passport.authenticate('local',(err,user, info)=>
        {
            // server error
            if (err)
            {
                return next(err);
            }
            // login error
            if (!user)
            {
                req.flash('loginMessage',
                    'AuthenticationError');
                return res.redirect('/login');
            }
            req.login(user,(err)=>{
                if(err)
                {
                    return next(err)
                }
                return res.redirect('/InventoryRT');
            })
        }) (req,res,next)
}
module.exports.DisplayRegistrationPage = (req, res, next)=>{
    // check if user is logged in
    if(!req.user)
    {
        res.render('auth/register',
            {
                title: 'login',
                message: req.flash('registerMessage'),
                DisplayName: req.user ? req.user.DisplayName: ''
            });
    }
    else
    {
        return res.redirect('/')
    }
}
module.exports.ProcessRegistrationPage = (req, res, next)=>{
    let newUser = new User({
        username: req.body.username,
        email:req.body.email,
        DisplayName: req.body.DisplayName
    })
    User.register(newUser, req.body.password, (err)=>{
        if(err) {
            console.log('Error: inserting new user')

            if (err.name == 'UserExistsError') {
                req.flash('registerMessage',
                    'Registation Error: User Already Exists');
            }
            return res.render('auth/register',
                {
                    title: 'Register',
                    message: req.flash('registerMessage'),
                    DisplayName: req.user ? req.user.DisplayName : ''
                });
        }
        else
            {
                return passport.authenticate('local')(req, res, () => {
                    res.redirect('/InventoryRT');
                })
            }
    })
}
module.exports.PerformLogout = (req, res, next)=>{
    req.logout(function(err){
        if(err){
            return next(err);
        }
    })
    res.redirect('/');
}