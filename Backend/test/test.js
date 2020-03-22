var chai = require('chai');
var chaiHttp = require('chai-http');
var should = require('chai').should();
chai.use(chaiHttp);
var assert = require('assert');
var expect = chai.expect;

var testInput_email = "ronald@gmail.com";
var testInput_password = "admin";
var studentId = 1;

describe('HandShake test Cases:', () => {

    // Get list of Job details
    it("Test Case 1 - Details of an existing job Get", (done) => {
        chai.request('http://localhost:3001/handshake')
            .get(`/joblist`)
            .set('Accept', 'application/json')
            .end((err, res) => {
                expect(err).to.be.null;
                res.body.should.be.a('array');
                res.status.should.be.equal(200);
                expect(res.body[0].title).to.equal('Nokia AP Developer')
                done();
            });
    })

    // Get Event details based on event name
    it("Test Case 2 - Details of an existing event Get", (done) => {

        let eventSearchData = {
            "query": "hiring",
        }

        chai.request('http://localhost:3001/handshake')
            .post(`/eventsearch`)
            .send(eventSearchData)
            .end((err, res) => {
                expect(err).to.be.null;
                res.body.should.be.a('array');
                res.status.should.be.equal(200);
                expect(res.body[0].companyID).to.equal(1);
                done();
            });
    })


    // Login as Student
    it("Test Case 3 - Student Login Post", (done) => {

        let studentLoginData = {
            "username": testInput_email,
            "password": testInput_password
        }

        chai.request('http://localhost:3001/handshake')
            .post('/student_login')
            .send(studentLoginData)
            .end(function (err, res) {
                expect(err).to.be.null;
                res.should.have.status(200);
                res.body.should.have.property('responseMessage').equal('Login Successful');
                done();
            });
    })


    // Search for job list based on category
    it("Test Case 4 - Search for job listings based on category Post", (done) => {

        let jobSearchdata = {
            query: "developer",
            category: "internship",
        }
        chai.request('http://localhost:3001/handshake')
            .post('/jobsearch')
            .send(jobSearchdata)
            .end((err, res) => {
                expect(err).to.be.null;
                res.status.should.be.equal(200);
                res.should.be.json;
                expect(res.body.length).to.equal(1)
                done();
            });
    })

    // Get Profile details
    it("Test Case 5 - Get Profile Details Post", (done) => {
        chai.request('http://localhost:3001/handshake')
            .get(`/student/${studentId}`)
            .end((err, res) => {
                expect(err).to.be.null;
                res.status.should.be.equal(200);
                res.should.be.json;
                var obj = JSON.parse(res.text)
                expect(obj[0].name).to.equal("prat")
                expect(obj[0].collegeName).to.equal("SJSU")
                expect(obj[0].country).to.equal("USA")
                done();
            });
    })
})