var express = require('express');
var pool = require('../models/database.js');
var router = express.Router();
var async = require('async');

function parseCookies(request) {
  var list = {},
    rc = request.headers.cookie;


  rc && rc.split(';').forEach(function (cookie) {
    var parts = cookie.split('=');
    list[parts.shift().trim()] = decodeURI(parts.join('='));
  });

  return list;
}



router.route('/company/').get(function (req, res) {
  var cookies = parseCookies(req);
  console.log(cookies);

  if ('cookie4' in cookies) {
    var companyId = cookies.cookie4;
    console.log(cookies.cookie4);
    res.redirect('/handshake/company/' + companyId);
  } else {
    res.redirect('/handshake/company_login');
  }
});


// Search company by id
router.route('/student/:id').get(function (req, res) {
    console.log(req.params.id);
    sqlquery = "SELECT * FROM `company_users` a LEFT JOIN `company_profiles` b ON a.companyID = b.companyID  where a.companyID = " + req.params.id;
    console.log(sqlquery);
    pool.query(sqlquery, [], function (error, result) {
      if (error) {
        console.log(error);
        console.log("Company not found");
        res.status(400).json({ responseMessage: 'Company not found' });
      } else {
        console.log(JSON.stringify(result));
        res.writeHead(200, { 'content-type': 'application/json' });
        res.end(JSON.stringify(result));
        console.log("Company Details Found");
      }
    });
  });


  //update student profile
router.route('/updatecompanyprofile').post(function (req, res) {

    console.log("In company update profile");
  
    var cookies = parseCookies(req);
    console.log(cookies);
  
    if ('cookie4' in cookies) {
      var companyId = cookies.cookie4;
    }
    else {
      res.redirect('/handshake/company_login');
    }
  
    var userData = {
      name: req.body.name,
      location: req.body.location,
      contactinfo: req.body.contactinfo,
      description: req.body.description,
      profilepic: req.body.profilepic,
    }
  
    console.log(userData);
  
    pool.query('SELECT EXISTS(SELECT * from company_profiles WHERE companyID = ?) as exist', companyId, (err, rows) => {
      if (err) {
        console.log(err);
        console.log("unable to read the database");
        res.status(400).json({ responseMessage: 'unable to read the company_profiles database' });
      } else {
        console.log(rows);
        console.log(rows[0].exist);
        if (row[0].exist) {
  
          console.log("company already exists");
  
          var sqlquery = "UPDATE company_profiles SET ? where companyID = " + companyId;
          pool.query(sqlquery, userData, (err, result) => {
            if (err) {
              console.log(err);
              console.log("unable to update company_profiles");
              res.status(400).json({ responseMessage: 'unable to update profile' });
            } else {
              console.log(result);
              console.log("Company profile Updated");
              res.status(200).json({ responseMessage: 'Company Profile Updated' });
              // pool.query('SELECT * FROM student_profiles WHERE studentID = ?', studentId, (err, result) => {
              //   if (err) {
              //     console.log(err);
              //     res.status(400).json({ responseMessage: 'student not found' });
              //   } else {
              //     res.writeHead(200, { 'content-type': 'application/json' });
              //     res.end(JSON.stringify(result));
  
              //     console.log("Profile Updated");
              //   }
              // });
            }
  
          });
        }
        else {
          userData.studentID = studentId;
          pool.query('INSERT INTO `company_profiles` SET ?', userData, function (error, result) {
            if (error) {
              console.log(error);
              console.log("unable to insert into company_profiles database");
              res.status(400).json({ responseMessage: 'unable to insert into company_profiles database' });
            } else {
              console.log(result);
              console.log("profile Updated");
              res.status(200).json({ responseMessage: 'Profile Updated' });
            }
          });
  
        }
      }
    });
  });

module.exports = router;