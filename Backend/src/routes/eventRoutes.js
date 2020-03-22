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

// create event
router.route('/createevent').post(function (req, res) {

    console.log("In create event ");
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
        eventName: req.body.eventName,
        time: req.body.time,
        date: req.body.date,
        description: req.body.description,
        eligibility: req.body.eligibility,
        location: req.body.location,

    }

    console.log(userData);

    pool.query('INSERT INTO `events` SET ?', userData, function (error, result) {
        if (error) {
            console.log(error);
            console.log("unable to insert into events database");
            res.status(400).json({ responseMessage: 'unable to insert into events database' });
        } else {
            console.log(result);
            console.log("events added");
            res.status(200).json({ responseMessage: 'events added' });
        }
    });
});


// Search events
router.route('/eventlist').get(function (req, res) {
    
    sqlquery = "SELECT * FROM `events`";
    console.log(sqlquery);
    pool.query(sqlquery, [], function (error, result) {
        if (error) {
            console.log(error);
            console.log("events not found");
            res.status(400).json({ responseMessage: 'events not found' });
        } else {
            console.log("events result: " + JSON.stringify(result));
            res.writeHead(200, { 'content-type': 'application/json' });
            res.end(JSON.stringify(result));
            console.log("event Details Found");
        }
    });
});

// Search company events
router.route('/companyeventlist').get(function (req, res) {
    
    var cookies = parseCookies(req);
    console.log(cookies);
    if ('cookie4' in cookies) {
        var companyId = cookies.cookie4;
    }
    else {
        res.redirect('/handshake/company_login');
    }
    sqlquery = "SELECT * FROM `events` where companyID = ?";
    console.log(sqlquery);
    pool.query(sqlquery, companyId, function (error, result) {
        if (error) {
            console.log(error);
            console.log("events not found");
            res.status(400).json({ responseMessage: 'events not found' });
        } else {
            console.log("events result: " + JSON.stringify(result));
            res.writeHead(200, { 'content-type': 'application/json' });
            res.end(JSON.stringify(result));
            console.log("event Details Found");
        }
    });
});


// Search company events
router.route('/registeredstudents').post(function (req, res) {
    
   
    sqlquery = "SELECT * FROM `events_registrations` a LEFT JOIN `student_users` b ON a.studentID = b.studentID where eventID = ?";
    console.log(sqlquery);
    pool.query(sqlquery, req.body.eventID, function (error, result) {
        if (error) {
            console.log(error);
            console.log("Students registered for event not found");
            res.status(400).json({ responseMessage: 'No one registered for event' });
        } else {
            console.log("student result: " + JSON.stringify(result));
            res.writeHead(200, { 'content-type': 'application/json' });
            res.end(JSON.stringify(result));
            console.log("student Details Found");
        }
    });
});



// Search registered events
router.route('/registeredevents').get(function (req, res) {
    var cookies = parseCookies(req);
    console.log(cookies);
    if ('cookie4' in cookies) {
        var studentId = cookies.cookie4;
    }
    else {
        res.redirect('/handshake/student_login');
    }
    
    sqlquery = "select * from `events_registrations` a LEFT JOIN `events` b ON a.eventID=b.eventID where a.studentID = " + studentId;
    console.log(sqlquery);
    pool.query(sqlquery, [], function (error, result) {
        if (error) {
            console.log(error);
            console.log("registered events not found");
            res.status(400).json({ responseMessage: 'registered events not found' });
        } else {
            console.log("registered events result: " + JSON.stringify(result));
            res.writeHead(200, { 'content-type': 'application/json' });
            res.end(JSON.stringify(result));
            console.log("registered event Details Found");
        }
    });
});

// register event
router.route('/registerevent').post(function (req, res) {

    console.log("In register event ");
    var cookies = parseCookies(req);
    console.log(cookies);
    if ('cookie4' in cookies) {
        var studentId = cookies.cookie4;
    }
    else {
        res.redirect('/handshake/student_login');
    }


    sqlquery = "select * from `events` a JOIN `student_education` b ON a.eligibility = b.major where eventID = " +req.body.eventID +" and studentID = "+ studentId;
    console.log(sqlquery);
    pool.query(sqlquery,[], function (error, result) {
        if (error) {
            console.log(error);
            console.log("You can not register for this event");
            res.status(400).json({ responseMessage: 'You can not register for this event' });
        } else {
            if (result.length > 0) {
                var userData = {
                    studentID: studentId,
                    eventID: req.body.eventID,
                }
                console.log(userData);

                pool.query('INSERT INTO `events_registrations` SET ?', userData, function (error, result) {
                    if (error) {
                        console.log(error);
                        console.log("unable to insert into events_registrations database");
                        res.status(400).json({ responseMessage: 'unable to insert into events_registartions database' });
                    } else {
                        console.log(result);
                        console.log("events registered");
                        // res.status(200).json({ responseMessage: 'events registered' });
                    }
                });

                console.log("registered events result: " + JSON.stringify(result));
                res.writeHead(200, { 'content-type': 'application/json' });
                res.end(JSON.stringify(result));
                console.log("registered event Details Found");
            } else {
                res.status(201).json({responseMessage: 'no events'});
            }
        }
    });
         
});

// Search events by event name
router.route('/eventsearch').post(function (req, res) {
    
    
    sqlquery = "select * from `events` where eventName like '%" + req.body.query + "%'";
    console.log(sqlquery);
    pool.query(sqlquery, [], function (error, result) {
        if (error) {
            console.log(error);
            console.log("Events not found");
            res.status(400).json({ responseMessage: 'Events not found' });
        } else {
            console.log(JSON.stringify(result));
            res.writeHead(200, { 'content-type': 'application/json' });
            res.end(JSON.stringify(result));
            console.log("Events Details Found");
        }
    });
});

module.exports = router;