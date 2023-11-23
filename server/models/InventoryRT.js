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
module.exports = mongoose.model('Products',ProductModel);
