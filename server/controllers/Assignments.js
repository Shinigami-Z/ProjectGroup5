var express = require('express');
var router = express.Router();
//const { router } = require('../config/app');
let Assignment = require('../models/Assignments');

module.exports.DislayAssignments = async (req, res, next)=>{ //< Mark function as async
    try{
        const Assignments = await Assignment.find(); //< Use of await keyword
        res.render('Assignment/list', {
            title: 'Assignments',
            Assignments: Assignments
        });
    }catch(err){
        console.error(err);
        //Handle error
        res.render('Assignment/list', {
            error: 'Error on server'
        });
    }
};

module.exports.AddAssignment = async (req, res, next)=>{
    try{
        res.render('Assignment/add',
            {
                title:'Add Assignment'
            })
    }
    catch(err)
    {
        console.error(err);
        res.render('Assignment/list',
            {
                error: 'Error on the server'
            });
    }
};

module.exports.CreateAssignment = async (req, res, next)=>{
    try{
        let newAssignment = Assignment({
            "Course":req.body.Course,
            "AssignmentName": req.body.AssignmentName,
            "DueDate": req.body.DueDate,
        });
        Assignment.create(newAssignment).then(() =>{
            res.redirect('/assignments')
        })
    }
    catch(error){
        console.error(err);
        res.render('Assignment/list',
            {
                error: 'Error on the server'
            });
    }
};
    
module.exports.EditAssignment = async (req, res, next)=>{
    try{
        const id = req.params.id;
        const assignmentToEdit = await Assignment.findById(id);
        res.render('Assignment/edit',
            {
                title:'Edit Assignment',
                Assignment:assignmentToEdit
            })
    }
    catch(error){
        console.error(err);
        res.render('Assignment/list',
            {
                error: 'Error on the server'
            });
    }
}

module.exports.ProcessEditAssignment = (req, res, next)=>{
    try{
        const id = req.params.id;
        let updatedAssignment = Assignment({
            "_id":id,
            "Course":req.body.Course,
            "AssignmentName": req.body.AssignmentName,
            "DueDate": req.body.DueDate,
        });
        Assignment.findByIdAndUpdate(id,updatedAssignment).then(()=>{
            res.redirect('/assignments')
        });
    }
    catch(error){
        console.error(err);
        res.render('Assignment/list',
            {
                error: 'Error on the server'
            });
    }
}

module.exports.DeleteAssignment = (req, res, next)=>{
    try{
        let id = req.params.id;
        Assignment.deleteOne({_id:id}).then(() =>
        {
            res.redirect('/assignments')
        })
    }
    catch(error){
        console.error(err);
        res.render('Assignment/list',
            {
                error: 'Error on the server'
            });
    }
}