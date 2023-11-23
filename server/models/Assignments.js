let mongoose = require('mongoose');

// create a model class
let assignmentsModel = mongoose.Schema({
    ItemName:String,
    NumOfUnits:Number,
    PricePerUnit:Number,
    TotalValue:Number
},
{
    collection:"inventory"
});
module.exports = mongoose.model('Assignments',assignmentsModel);
