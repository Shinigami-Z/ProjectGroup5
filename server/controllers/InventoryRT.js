var express = require('express');
var router = express.Router();
//const { router } = require('../config/app');
let Products = require('../models/InventoryRT');

module.exports.DislayInventoryRT = async (req, res, next)=>{ //< Mark function as async
    try{
        const InventoryRT = await Products.find(); //< Use of await keyword
        res.render('Products/list', {
            title: 'InventoryRT',
            InventoryRT: InventoryRT
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
                title:'Add Products'
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
                Products:ProductsToEdit
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
