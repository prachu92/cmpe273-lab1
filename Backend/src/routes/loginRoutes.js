//Libraries
var express = require('express');
var pool = require('../models/database.js');
var router = express.Router();
var crypt = require('../models/bcrypt.js');

// Validate student login user details
router.route('/student_login').post(function (req, res) {
  console.log("Inside student Login Post");
  console.log(req.body);

  var email = req.body.username;
  var lowercaseemail = email.toLowerCase();
  var trimemail = lowercaseemail.trim();
  var password = req.body.password;
  
  pool.query('SELECT * FROM student_users WHERE email = ?', [trimemail], (err, rows) => {
    
    if (err) {
      console.log("User does not exist");
      res.status(400).json({responseMessage: 'User does not exist'});
    } else {
      if (rows.length > 0) {
        // Check if password matches
        crypt.compareHash(password, rows[0].password, function (err, isMatch) {
          if (isMatch && !err) {
            res.cookie('cookie1',"studentcookie",{maxAge: 900000, httpOnly: false, path : '/'});
            res.cookie('cookie2',trimemail,{maxAge: 900000, httpOnly: false, path : '/'});
            res.cookie('cookie3',rows[0].name,{maxAge: 900000, httpOnly: false, path : '/'});
            res.cookie('cookie4',rows[0].studentID,{maxAge: 900000, httpOnly: false, path : '/'});
            req.session.user = rows[0].email;
            res.status(200).json({responseMessage: 'Login Successful'});
            console.log("Student found in DB");
          } else {
            res.status(401).json({responseMessage: 'Authentication failed. Passwords did not match.'})
            console.log("Authentication failed. Passwords did not match.");
          }
        })
      }
      else {
        res.status(402).json({responseMessage: 'Authentication failed. User does not exist.'})
        console.log("Authentication failed. User does not exist.");
        
      }
    }
  });
});

// Validate company login user details
router.route('/company_login').post(function (req, res) {
  console.log("Inside company Login Post");
  var email = req.body.username;
  var lowercaseemail = email.toLowerCase();
  var trimemail = lowercaseemail.trim();
  var password = req.body.password;
  
  pool.query('SELECT * FROM company_users WHERE email = ?', [trimemail], (err, rows) => {
    if (err) {
      console.log("User does not exist");
      res.status(400).json({responseMessage: 'User does not exist'});
    } else {
      if (rows.length > 0) {
        crypt.compareHash(password, rows[0].password, function (err, isMatch) {
          if (isMatch && !err ) {
            res.cookie('cookie1',"companycookie",{maxAge: 900000, httpOnly: false, path : '/'});
            res.cookie('cookie2',trimemail,{maxAge: 900000, httpOnly: false, path : '/'});
            res.cookie('cookie3',rows[0].name,{maxAge: 900000, httpOnly: false, path : '/'});
            res.cookie('cookie4',rows[0].companyID,{maxAge: 900000, httpOnly: false, path : '/'});
            req.session.user = rows[0].email;
            console.log("company found in DB");
            res.status(200).json({responseMessage: 'Login Successful'});
          } else {
            res.status(401).json({responseMessage: 'Authentication failed. Passwords did not match.'})
            console.log("Authentication failed. Passwords did not match.");
          }
        })
      }
      else {
        res.status(402).json({responseMessage: 'Authentication failed. User does not exist.'})
        console.log("Authentication failed. User does not exist.");
      }
    }
  });
});


// Add student users
router.route('/student_signup').post(function (req, res) {
  console.log("In student Signup Post");
  console.log(req.body);
  email = req.body.email.toLowerCase();
  trimemail = email.trim();
  var today = new Date();
  var year = today.getFullYear();
  
  pool.query('SELECT * FROM student_users WHERE email = ?', [trimemail], (err, rows) => {
    if (err){
        console.log(err);
        console.log("unable to read the database");
        res.status(400).json({responseMessage: 'unable to read the users database'});
    } else {
      if (rows.length > 0) {
        console.log("User already exists");
        res.status(400).json({responseMessage: 'User already exists'});
      } else {
        
        crypt.createHash(req.body.password, function (response) {
          encryptedPassword = response;

          var userData = {
            "name": req.body.name,
            "email": trimemail,
            "password": encryptedPassword,
            "collegeName": req.body.collegeName
          }
        
          //Save the user in database
          pool.query('INSERT INTO student_users SET ?',userData, function (err) {
          if (err) {
            console.log("unable to insert into database", err);
            res.status(400).send("unable to insert into database");
          } else {
            console.log("student User Added");
            // console.log(rows[0]);
            // res.cookie('cookie1',"studentcookie",{maxAge: 900000, httpOnly: false, path : '/'});
            // res.cookie('cookie2',trimemail,{maxAge: 900000, httpOnly: false, path : '/'});
            // res.cookie('cookie3',req.body.name,{maxAge: 900000, httpOnly: false, path : '/'});
            // res.cookie('cookie4',rows[0].studentID,{maxAge: 900000, httpOnly: false, path : '/'});
            res.status(200).json({responseMessage: 'student User Added'});
          }});
      }, function (err) {
          console.log(err);
        });
      }
    }
  });
});

// Add company  users
router.route('/company_signup').post(function (req, res) {
  console.log("In company Signup Post");
  email = req.body.email.toLowerCase();
  trimemail = email.trim();
  var today = new Date();
  var year = today.getFullYear();
  
  pool.query('SELECT * FROM company_users WHERE email = ?', [trimemail], (err, rows) => {
    if (err){
        console.log(err);
        console.log("unable to read the database");
        res.status(400).json({responseMessage: 'unable to read the users database'});
    } else {
      if (rows.length > 0) {
        
          console.log("company already exists");
          res.status(400).json({responseMessage: 'company already exists'});
    } else {

        crypt.createHash(req.body.password, function (response) {
          encryptedPassword = response;
      
          var userData = {
            "name": req.body.name,
            "email": trimemail,
            "password": encryptedPassword,
            "location": req.body.location
          }
      
          //Save the user in database
          pool.query('INSERT INTO company_users SET ?',userData, function (err) {
          if (err) {
            console.log("unable to insert into database");
            res.status(400).json({responseMessage: 'unable to insert into company_users database'});
          } else {
            console.log("Company Added");
            // res.cookie('cookie1',"companycookie",{maxAge: 900000, httpOnly: false, path : '/'});
            // res.cookie('cookie2',trimemail,{maxAge: 900000, httpOnly: false, path : '/'});
            // res.cookie('cookie3',req.body.name,{maxAge: 900000, httpOnly: false, path : '/'});
            res.status(200).json({responseMessage: 'company Added'});
          }});
        })
      }
    }
  })
});

// // fetch user profile details
// router.route('/profile').post(function (req, res) {
//   console.log("Inside Profile fetch");
//   var input_email = req.body.email;
//   console.log(input_email);
//   pool.query('SELECT * FROM users WHERE email = ?', [input_email], (err, result) => {
//     if (err){
//       console.log(err);
//       res.status(400).json({responseMessage: 'User not found'});
//     }else {
//       res.writeHead(200, {'content-type':'application/json'});
//       res.end(JSON.stringify(result));
//     }
//   })
// });

// // save user profile details
// router.route('/profilesave').post(function (req, res) {
//   console.log("In profile save Post");
//   email = req.body.email.toLowerCase();
//   trimemail = email.trim();
  
//   var userData = {
//     "firstname": req.body.firstname,
//     "lastname": req.body.lastname,
//     "aboutMe" : req.body.aboutMe,
//     "city" : req.body.city,
//     "state" : req.body.state,
//     "country" : req.body.country,
//     "company" : req.body.company,
//     "school" : req.body.school,
//     "hometown" : req.body.hometown,
//     "gender" : req.body.gender,
//     "phone" : req.body.phone
//   }

//   console.log(userData);
//   pool.query('UPDATE users SET ? WHERE email = ?', [userData, trimemail], function (err) {
//     if (err) {
//       console.log(err);
//       console.log("unable to update database");
//       res.status(400).json({responseMessage: 'unable to update database'});
//     } else {
//       pool.query('SELECT * FROM users WHERE email = ?', [trimemail], (err, result) => {
//         if (err){
//           console.log(err);
//           res.status(400).json({responseMessage: 'User not found'});
//         }else {
//           res.writeHead(200, {'content-type':'application/json'});
//           res.end(JSON.stringify(result));
//         }
//       })
//     }
//   })
// });

module.exports = router;