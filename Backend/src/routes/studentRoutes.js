var express = require('express');
var pool = require('../models/database.js');
var router = express.Router();
var async = require('async');

// Search student by id
router.route('/student/:id').get(function (req, res) {
    console.log(req.params.id);
    pool.query('SELECT * FROM `student_users` a INNER JOIN `student_profiles` b ON a.studentID = b.studentID INNER JOIN `student_education` c ON a.studentID = c.studentID INNER JOIN `student_experience` d ON a.studentID = d.studentID INNER JOIN `student_skills` e ON a.studentID = e.studentID where a.studentID = ?  ', [req.params.id], function (error, result) {
      if (error) {
        console.log(error);
        console.log("Student not found");
        res.status(400).json({responseMessage: 'Student not found'});
      } else {
        console.log(JSON.stringify(result));
        res.writeHead(200, {'content-type':'application/json'});
        res.end(JSON.stringify(result));
        console.log("Student Details Found");
      }
    });    
  });


  // Search Booking by name
router.route('/student/:name').get(function (req, res) {
  console.log(req.params.id);
  pool.query('SELECT * from `student_users` a INNER JOIN `student_profiles` b ON a.studentID = b.studentID where a.name = ? ', [req.params.name], function (error, result) {
    if (error) {
      console.log(error);
      console.log("Student not found");
      res.status(400).json({responseMessage: 'Student not found'});
    } else {
      console.log(JSON.stringify(result));
      res.writeHead(200, {'content-type':'application/json'});
      res.end(JSON.stringify(result));
      console.log("Student Details Found");
    }
  });    
});


// Search students by college name
router.route('/student/:collegename').get(function (req, res) {
  console.log(req.params.id);
  pool.query('SELECT * from `student_users` a INNER JOIN `student_profiles` b ON a.studentID = b.studentID where a.collegeName = ? ', [req.params.collegeName], function (error, result) {
    if (error) {
      console.log(error);
      console.log("Student not found");
      res.status(400).json({responseMessage: 'Student not found'});
    } else {
      console.log(JSON.stringify(result));
      res.writeHead(200, {'content-type':'application/json'});
      res.end(JSON.stringify(result));
      console.log("Booking Details Found");
    }
  });    
});

// Search students by skills
router.route('/student/:skills').get(function (req, res) {
  console.log(req.params.id);
  pool.query('SELECT * from `student_users` a INNER JOIN `student_skills` b ON a.studentID = b.studentID INNER JOIN `student_profile` c ON a.studentID = c.studentID  where b.skillName = ? ', [req.params.skillName], function (error, result) {
    if (error) {
      console.log(error);
      console.log("Student not found");
      res.status(400).json({responseMessage: 'Student not found'});
    } else {
      console.log(JSON.stringify(result));
      res.writeHead(200, {'content-type':'application/json'});
      res.end(JSON.stringify(result));
      console.log("Booking Details Found");
    }
  });    
});


  
