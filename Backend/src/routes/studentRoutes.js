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



router.route('/student/').get(function (req, res) {
  var cookies = parseCookies(req);
  console.log(cookies);

  if ('cookie4' in cookies) {
    var studentId = cookies.cookie4;
    console.log(cookies.cookie4);
    res.redirect('/handshake/student/' + studentId);
  } else {
    res.redirect('/handshake/student_login');
  }
});

// Search student by id
router.route('/student/:id').get(function (req, res) {
  console.log(req.params.id);
  sqlquery = "SELECT * FROM `student_users` a LEFT JOIN `student_profiles` b ON a.studentID = b.studentID LEFT JOIN `student_education` c ON a.studentID = c.studentID LEFT JOIN `student_experience` d ON a.studentID = d.studentID LEFT JOIN `student_skills` e ON a.studentID = e.studentID where a.studentID = " + req.params.id;
  console.log(sqlquery);
  pool.query(sqlquery, [], function (error, result) {
    if (error) {
      console.log(error);
      console.log("Student not found");
      res.status(400).json({ responseMessage: 'Student not found' });
    } else {
      console.log(JSON.stringify(result));
      res.writeHead(200, { 'content-type': 'application/json' });
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
      res.status(400).json({ responseMessage: 'Student not found' });
    } else {
      console.log(JSON.stringify(result));
      res.writeHead(200, { 'content-type': 'application/json' });
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
      res.status(400).json({ responseMessage: 'Student not found' });
    } else {
      console.log(JSON.stringify(result));
      res.writeHead(200, { 'content-type': 'application/json' });
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
      res.status(400).json({ responseMessage: 'Student not found' });
    } else {
      console.log(JSON.stringify(result));
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify(result));
      console.log("Booking Details Found");
    }
  });
});

// Add Profile for first time
router.route('/student/profile').post(function (req, res) {

  console.log("In student profile");

  var userData = {
    careerObj: req.body.careerObj,
    dob: req.body.dob,
    city: req.body.city,
    state: req.body.state,
    country: req.body.country,
    profilePic: req.body.profilePic,
    phoneNo: req.body.phoneNo,
  }

  console.log(userData);
  pool.query('INSERT INTO `student_profiles` SET ?', userData, function (error, result) {
    if (error) {
      console.log(error);
      console.log("unable to insert into student_profiles database");
      res.status(400).json({ responseMessage: 'unable to insert into student_profiles database' });
    } else {
      console.log(result);
      console.log("profile Updated");
      res.status(200).json({ responseMessage: 'Profile Updated' });
    }
  });
});

//update student profile
router.route('/updatestudentprofile').post(function (req, res) {

  console.log("In student update profile");

  var cookies = parseCookies(req);
  console.log(cookies);

  if ('cookie4' in cookies) {
    var studentId = cookies.cookie4;
  }
  else {
    res.redirect('/handshake/student_login');
  }

  var userData = {
    careerObj: req.body.careerObj,
    dob: req.body.dob,
    city: req.body.city,
    state: req.body.state,
    country: req.body.country,
    profilePic: req.body.profilePic,
    phoneNo: req.body.phoneNo,
  }

  console.log(userData);

  pool.query('SELECT EXISTS(SELECT * from student_profiles WHERE studentID = ?) as exist', studentId, (err, rows) => {
    if (err) {
      console.log(err);
      console.log("unable to read the database");
      res.status(400).json({ responseMessage: 'unable to read the student_profiles database' });
    } else {
      console.log(rows);
      console.log(rows[0].exist);
      if (row[0].exist) {

        console.log("student already exists");

        var sqlquery = "UPDATE student_profiles SET ? where studentID = " + studentId;
        pool.query(sqlquery, userData, (err, result) => {
          if (err) {
            console.log(err);
            console.log("unable to update student_profiles");
            res.status(400).json({ responseMessage: 'unable to update profile' });
          } else {
            console.log(result);
            console.log("career objective Updated");
            res.status(200).json({ responseMessage: 'career objective Updated' });
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
        pool.query('INSERT INTO `student_profiles` SET ?', userData, function (error, result) {
          if (error) {
            console.log(error);
            console.log("unable to insert into student_profiles database");
            res.status(400).json({ responseMessage: 'unable to insert into student_profiles database' });
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



//update career objective
router.route('/updatecareerobjective').post(function (req, res) {

  console.log("In update career objective");

  var cookies = parseCookies(req);
  console.log(cookies);

  if ('cookie4' in cookies) {
    var studentId = cookies.cookie4;
  }
  else {
    res.redirect('/handshake/student_login');
  }

  var userData = {
    careerObj: req.body.careerObj,
  }

  console.log(userData);

  pool.query('SELECT EXISTS(SELECT * from student_profiles WHERE studentID = ?) as exist', studentId, (err, rows) => {
    if (err) {
      console.log(err);
      console.log("unable to read the database");
      res.status(400).json({ responseMessage: 'unable to read the student_profiles database' });
    } else {
      console.log(rows);
      console.log(rows[0].exist);
      if (rows[0].exist) {

        console.log("student already exists");

        var sqlquery = "UPDATE student_profiles SET ? where studentID = " + studentId;
        pool.query(sqlquery, userData, (err, result) => {
          if (err) {
            console.log(err);
            console.log("unable to update career objective");
            res.status(400).json({ responseMessage: 'unable to update career objective' });
          } else {

            console.log(result);
            console.log("career objective Updated");
            res.status(200).json({ responseMessage: 'career objective Updated' });
          }

        });
      }
      else {
        userData.studentID = studentId;
        pool.query('INSERT INTO `student_profiles` SET ?', userData, function (error, result) {
          if (error) {
            console.log(error);
            console.log("unable to insert into student_profiles database");
            res.status(400).json({ responseMessage: 'unable to insert into student_profiles database' });
          } else {
            console.log(result);
            console.log("career objective Updated");
            res.status(200).json({ responseMessage: 'career objective Updated' });
          }
        });

      }
    }
  });
});



//update student education
router.route('/updateeducation').post(function (req, res) {

  console.log("In update education");

  var cookies = parseCookies(req);
  console.log(cookies);

  if ('cookie4' in cookies) {
    var studentId = cookies.cookie4;
  }
  else {
    res.redirect('/handshake/student_login');
  }

  var userData = {
    college: req.body.college,
    location: req.body.location,
    degree: req.body.degree,
    major: req.body.major,
    yop: req.body.yop,
    cgpa: req.body.cgpa
  }

  console.log(userData);

  pool.query('SELECT EXISTS(SELECT * from student_education WHERE studentID = ?) as exist', studentId, (err, rows) => {
    if (err) {
      console.log(err);
      console.log("unable to read the database");
      res.status(400).json({ responseMessage: 'unable to read the student_education database' });
    } else {
      console.log(rows);
      console.log(rows[0].exist);
      if (rows[0].exist) {

        console.log("student already exists");

        var sqlquery = "UPDATE student_education SET ? where studentID = " + studentId;
        pool.query(sqlquery, userData, (err, result) => {
          if (err) {
            console.log(err);
            console.log("unable to update student education");
            res.status(400).json({ responseMessage: 'unable to update student education' });
          } else {

            console.log(result);
            console.log("student education updated");
            res.status(200).json({ responseMessage: 'student education updated' });
          }

        });
      }
      else {
        userData.studentID = studentId;
        pool.query('INSERT INTO `student_education` SET ?', userData, function (error, result) {
          if (error) {
            console.log(error);
            console.log("unable to insert into student_education database");
            res.status(400).json({ responseMessage: 'unable to insert into student_education database' });
          } else {
            console.log(result);
            console.log("student education Updated");
            res.status(200).json({ responseMessage: 'student education Updated' });
          }
        });

      }
    }
  });
});




//update student skills
router.route('/updateskills').post(function (req, res) {

  console.log("In update skills");

  var cookies = parseCookies(req);
  console.log(cookies);

  if ('cookie4' in cookies) {
    var studentId = cookies.cookie4;
  }
  else {
    res.redirect('/handshake/student_login');
  }

  
  var userData = {
    skillName:req.body.skillName
  }

  console.log(userData);

  pool.query('SELECT EXISTS(SELECT * from student_skills WHERE studentID = ?) as exist', studentId, (err, rows) => {
    if (err) {
      console.log(err);
      console.log("unable to read the database");
      res.status(400).json({ responseMessage: 'unable to read the student_skills database' });
    } else {
      console.log(rows);
      console.log(rows[0].exist);
      if (rows[0].exist) {

        console.log("student already exists");

        var sqlquery = "UPDATE student_skills SET ? where studentID = " + studentId;
        pool.query(sqlquery, userData, (err, result) => {
          if (err) {
            console.log(err);
            console.log("unable to update student skills");
            res.status(400).json({ responseMessage: 'unable to update student skills' });
          } else {

            console.log(result);
            console.log("student skills updated");
            res.status(200).json({ responseMessage: 'student skills updated' });
          }

        });
      }
      else {
        userData.studentID = studentId;
        pool.query('INSERT INTO `student_skills` SET ?', userData, function (error, result) {
          if (error) {
            console.log(error);
            console.log("unable to insert into student_skills database");
            res.status(400).json({ responseMessage: 'unable to insert into student_skills database' });
          } else {
            console.log(result);
            console.log("student skills Updated");
            res.status(200).json({ responseMessage: 'student skills Updated' });
          }
        });

      }
    }
  });
});



//update student experience
router.route('/updateexperience').post(function (req, res) {

  console.log("In update experience");

  var cookies = parseCookies(req);
  console.log(cookies);

  if ('cookie4' in cookies) {
    var studentId = cookies.cookie4;
  }
  else {
    res.redirect('/handshake/student_login');
  }

 
  var userData = {
    
    company:req.body.company,
    title:req.body.title,
    location:req.body.location,
    startDate:req.body.startDate,
    endDate:req.body.endDate,
    
  }

  console.log(userData);

  pool.query('SELECT EXISTS(SELECT * from student_experience WHERE studentID = ?) as exist', studentId, (err, rows) => {
    if (err) {
      console.log(err);
      console.log("unable to read the database");
      res.status(400).json({ responseMessage: 'unable to read the student_ex database' });
    } else {
      console.log(rows);
      console.log(rows[0].exist);
      if (rows[0].exist) {

        console.log("student already exists");

        var sqlquery = "UPDATE student_experience SET ? where studentID = " + studentId;
        pool.query(sqlquery, userData, (err, result) => {
          if (err) {
            console.log(err);
            console.log("unable to update student skills");
            res.status(400).json({ responseMessage: 'unable to update student ex' });
          } else {

            console.log(result);
            console.log("student skills updated");
            res.status(200).json({ responseMessage: 'student ex updated' });
          }

        });
      }
      else {
        userData.studentID = studentId;
        pool.query('INSERT INTO `student_experience` SET ?', userData, function (error, result) {
          if (error) {
            console.log(error);
            console.log("unable to insert into student_ex database");
            res.status(400).json({ responseMessage: 'unable to insert into student_ex database' });
          } else {
            console.log(result);
            console.log("student ex Updated");
            res.status(200).json({ responseMessage: 'student ex Updated' });
          }
        });

      }
    }
  });
});




// Add education for first time
router.route('/student/experience').post(function (req, res) {

  console.log("In student experience");

  var userData = {
    company: req.body.company,
    title: req.body.title,
    location: req.body.location,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    description: req.body.description,
  }

  console.log(userData);
  pool.query('INSERT INTO `student_experience` SET ?', userData, function (error, result) {
    if (error) {
      console.log(error);
      console.log("unable to insert into student_experience database");
      res.status(400).json({ responseMessage: 'unable to insert into student_profiles database' });
    } else {
      console.log(result);
      console.log("experience updated");
      res.status(200).json({ responseMessage: 'experience updated' });
    }
  });
});

//update student profile
router.route('/student/updateexperience').post(function (req, res) {

  console.log("In student update experience");

  var userData = {
    company: req.body.company,
    title: req.body.title,
    location: req.body.location,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    description: req.body.description,
  }


  console.log(userData);

  var sqlquery = "UPDATE student_experience SET ? where studentID = ?";
  pool.query(sqlquery, userData, req.body.studentID, (err) => {
    if (err) {
      console.log(err);
      console.log("unable to update student_experience");
      res.status(400).json({ responseMessage: 'unable to update experience' });
    } else {


      pool.query('SELECT * FROM student_experience WHERE studentID = ?', req.body.studentID, (err, result) => {
        if (err) {
          console.log(err);
          res.status(400).json({ responseMessage: 'student not found' });
        } else {
          res.writeHead(200, { 'content-type': 'application/json' });
          res.end(JSON.stringify(result));

          console.log("Experience Updated");
        }
      });
    }

  });
});




module.exports = router;