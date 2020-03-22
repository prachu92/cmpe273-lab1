var express = require('express');
var pool = require('../models/database.js');
var router = express.Router();
var async = require('async');
var multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        return cb(null, Date.now() + '_' + file.originalname);
    }
});
var upload = multer({ storage: storage }).single('resumePath');


function parseCookies(request) {
    var list = {},
        rc = request.headers.cookie;


    rc && rc.split(';').forEach(function (cookie) {
        var parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });

    return list;
}

// Search jobs
router.route('/joblist').get(function (req, res) {
    
    sqlquery = "SELECT * FROM `jobs`";
    console.log(sqlquery);
    pool.query(sqlquery, [], function (error, result) {
        if (error) {
            console.log(error);
            console.log("jobs not found");
            res.status(400).json({ responseMessage: 'jobs not found' });
        } else {
            console.log("Jobs result: " + JSON.stringify(result));
            res.writeHead(200, { 'content-type': 'application/json' });
            res.end(JSON.stringify(result));
            console.log("job Details Found");
        }
    });
});


// Search company jobs
router.route('/companyjoblist').get(function (req, res) {
    
    var cookies = parseCookies(req);
    console.log(cookies);

    if ('cookie4' in cookies) {
        var companyId = cookies.cookie4;
    }


    sqlquery = "SELECT * FROM `jobs` where companyID = ?";
    console.log(sqlquery);
    pool.query(sqlquery, companyId, function (error, result) {
        if (error) {
            console.log(error);
            console.log("jobs not found");
            res.status(400).json({ responseMessage: 'jobs not found' });
        } else {
            console.log("Jobs result: " + JSON.stringify(result));
            res.writeHead(200, { 'content-type': 'application/json' });
            res.end(JSON.stringify(result));
            console.log("job Details Found");
        }
    });
});


// Search jobs by category
router.route('/jobsearch').post(function (req, res) {
    console.log(req.body.category);
    
    sqlquery = "SELECT * FROM `jobs` where category = ? and title like '%" + req.body.query + "%'";
    console.log(sqlquery);
    pool.query(sqlquery, req.body.category, function (error, result) {
        if (error) {
            console.log(error);
            console.log("jobs not found");
            res.status(400).json({ responseMessage: 'jobs not found' });
        } else {
            console.log(JSON.stringify(result));
            res.writeHead(200, { 'content-type': 'application/json' });
            res.end(JSON.stringify(result));
            console.log("job Details Found");
        }
    });
});


//search for applied jobs
router.route('/appliedjobs').get(function (req, res) {
    console.log("Applied Jobs");
    var cookies = parseCookies(req);
    console.log(cookies);

    if ('cookie4' in cookies) {
        var studentId = cookies.cookie4;
    }

    sqlquery = "SELECT * FROM `jobs_applicants` a LEFT JOIN `jobs` b ON a.jobID = b.jobID  LEFT JOIN `company_profile` c ON b.companyID = c.companyID where a.studentID = ? ";
    console.log(sqlquery);
    pool.query(sqlquery, studentId, function (error, result) {
        if (error) {
            console.log(error);
            console.log("applied jobs not found");
            res.status(400).json({ responseMessage: 'applied jobs not found' });
        } else {
            console.log(JSON.stringify(result));
            res.writeHead(200, { 'content-type': 'application/json' });
            res.end(JSON.stringify(result));
            console.log("applied job Details Found");
        }
    });
});





//search for applicants for a company job
router.route('/jobapplicants').post(function (req, res) {
    console.log("Job applicants");
   // var cookies = parseCookies(req);
    // console.log(cookies);

    // if ('cookie4' in cookies) {
    //     var studentId = cookies.cookie4;
    // }

    sqlquery = "SELECT * FROM `jobs_applicants` a LEFT JOIN `student_profiles` b ON a.studentID = b.studentID LEFT JOIN `student_users` c ON a.studentID = c.studentID where jobID = ? ";
    console.log(sqlquery);
    pool.query(sqlquery, req.body.jobID, function (error, result) {
        if (error) {
            console.log(error);
            console.log("applied jobs not found");
            res.status(400).json({ responseMessage: 'applied jobs not found' });
        } else {
            console.log(JSON.stringify(result));
            res.writeHead(200, { 'content-type': 'application/json' });
            res.end(JSON.stringify(result));
            console.log("applied job Details Found");
        }
    });
});

// search for jobs based on application status

router.route('/appliedjobsstatus').get(function (req, res) {
    console.log(" Applied Jobs based on application status");
    var cookies = parseCookies(req);
    console.log(cookies);

    if ('cookie4' in cookies) {
        var studentId = cookies.cookie4;
    }

    sqlquery = "SELECT * FROM `jobs_applicants` where studentID = ? AND applicationstatus = " + req.params.applicationstatus;
    console.log(sqlquery);
    pool.query(sqlquery, studentId, function (error, result) {
        if (error) {
            console.log(error);
            console.log("applied jobs not found");
            res.status(400).json({ responseMessage: 'applied jobs not found' });
        } else {
            console.log(JSON.stringify(result));
            res.writeHead(200, { 'content-type': 'application/json' });
            res.end(JSON.stringify(result));
            console.log("applied job Details Found");
        }
    });
});

// create jobs
router.route('/createjob').post(function (req, res) {

    console.log("In create job ");
    var cookies = parseCookies(req);
    console.log(cookies);
    if ('cookie4' in cookies) {
        var companyId = cookies.cookie4;
    }
    else {
        res.redirect('/handshake/company_login');
    }

    var userData = {
        companyID: companyId,
        title: req.body.title,
        category: req.body.category,
        description: req.body.description,
        location: req.body.location,
        contactinfo: req.body.contactinfo,
    }

    console.log(userData);
    
    pool.query('INSERT INTO `jobs` SET ?', userData, function (error, result) {
        if (error) {
            console.log(error);
            console.log("unable to insert into jobs database");
            res.status(400).json({ responseMessage: 'unable to insert into jobs database' });
        } else {
            console.log(result);
            console.log("jobs added");
            res.status(200).json({ responseMessage: 'jobs added' });
        }
    });
});

// add job applications
router.route('/applyjob').post(function (req, res) {

    console.log("In apply job ");
    var cookies = parseCookies(req);
    console.log("Cookies: " + cookies);
    console.log(cookies);
    if ('cookie4' in cookies) {
        var studentId = cookies.cookie4;
    }
    // else {
    //     res.redirect('/handshake/student_login');
    // }

    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            console.log(err);
            return res.status(500).json(err);
        } else if (err) {
            console.log(err);
            return res.status(500).json(err);
        }

        console.log("Filename: " + req.file);
        // console.log("Req: " + req.body);
        var userData = {
            studentID: studentId,
            jobID: req.body.jobID,
            resumePath: req.file.filename, //req.body.resumePath,
            // applicationDate: req.body.applicationDate,
            // applicationDate: new Date('YYYY-MM-DD'),
            applicationStatus: req.body.applicationStatus,
            contactinfo: req.body.contactinfo,
        }
        console.log(userData);
        userData.studentID = studentId;
        pool.query('INSERT INTO `jobs_applicants` SET ?', userData, function (error, result) {
            if (error) {
                console.log(error);
                console.log("unable to insert into jobs_applicants database");
                res.status(400).json({ responseMessage: 'unable to insert into jobs_applicants database' });
            } else {
                console.log(result);
                console.log("jobs_applicants added");
                res.status(200).json({ responseMessage: 'jobs_applicants added' });
            }
        });
    });
});


// accept applicant

router.route('/acceptapplicant').post(function (req, res) {

    console.log("In accept applicant ");
    var cookies = parseCookies(req);
    console.log(cookies);
    if ('cookie4' in cookies) {
        var companyId = cookies.cookie4;
    }
    else {
        res.redirect('/handshake/company_login');
    }

    var userData = {
        studentID: req.body.studentID,
        jobID: req.body.jobID,
    }

    console.log(userData);
    
    sqlquery = "UPDATE `jobs_applicants` SET applicationStatus = 1 where studentID = "+ req.body.studentID  + " AND jobID = " + req.body.jobID;
    pool.query(sqlquery, [], function (error, result) {
        if (error) {
            console.log(error);
            console.log("unable to update into jobs_applicants database");
            res.status(400).json({ responseMessage: 'unable to update into jobs_applicants database' });
        } else {
            console.log(result);
            console.log("accepted added");
            res.status(200).json({ responseMessage: 'accepted added' });
        }
    });
});


module.exports = router;
