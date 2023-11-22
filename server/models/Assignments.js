let mongoose = require('mongoose');

// create a model class
let assignmentsModel = mongoose.Schema({
    Course:String,
    AssignmentName:String,
    DueDate:String,
},
{
    collection:"Assignments"
});
module.exports = mongoose.model('Assignments',assignmentsModel);
