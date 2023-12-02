let mongoose = require('mongoose');

// create a model class
let ProductModel = mongoose.Schema({
    ItemName:String,
    NumOfUnits:Number,
    PricePerUnit:Number,
    TotalValue:Number
},
{
    collection:"inventory"
});
// create a model class
let loginTracker = mongoose.Schema({
    username:Number,
    password:String
},
{
    collection:"login"
});
module.exports = mongoose.model('Products',ProductModel);
