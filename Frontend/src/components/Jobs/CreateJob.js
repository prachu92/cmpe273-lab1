import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';

class CreateJob extends Component {
    constructor() {
        super();
        this.state = {
            title: "",
            category: "",
            description: "",
            contactinfo: "",
            location: "",
            updated: false,
            authFlag: false,
        }
        this.titleChangeHandler = this.titleChangeHandler.bind(this);
        this.categoryChangeHandler = this.categoryChangeHandler.bind(this);
        this.descriptionChangeHandler = this.descriptionChangeHandler.bind(this);
        this.contactinfoChangeHandler = this.contactinfoChangeHandler.bind(this)
        this.locationChangeHandler = this.locationChangeHandler.bind(this);
        this.submitJob = this.submitJob.bind(this);


    }

    //Call the Will Mount to set the auth Flag to false
    componentWillMount() {
        this.setState({
            authFlag: false
        })
    }

    titleChangeHandler = (e) => {
        this.setState({
            title: e.target.value
        })
    }
    //city change handler to update state variable with the text entered by the user
    categoryChangeHandler = (e) => {
        this.setState({
            category: e.target.value
        })
    }
    //state change handler to update state variable with the text entered by the user
    descriptionChangeHandler = (e) => {
        this.setState({
            description: e.target.value
        })
    }

    contactinfoChangeHandler = (e) => {
        this.setState({
            contactinfo: e.target.value
        })
    }

    locationChangeHandler = (e) => {
        this.setState({
            location: e.target.value
        })
    }

    //submit Login handler to send a request to the node backend
    submitJob = (e) => {
        var headers = new Headers();
        //prevent page from refresh
        e.preventDefault();
        const data = {
            title: this.state.title,
            category: this.state.category,
            description: this.state.description,
            contactinfo: this.state.contactinfo,
            location: this.state.location
        }
        console.log("submit job " + data)

        //set the with credentials to true
        axios.defaults.withCredentials = true;
        //make a post request with the user data

        var link = "http://localhost:3001/handshake/createjob";

        axios.post(link, data)
            .then(response => {
                console.log("Status Code : ", response.status);
                if (response.status === 200) {
                    this.setState({
                        //authFlag: true,
                        updated: true

                    })
                } else {
                    this.setState({
                        updated: false
                    })
                    alert(" Job addition failed.");
                }
            });
    }


    render() {
        var redirectVar = null;
        console.log(cookie.load('cookie1'));
        if (!cookie.load('cookie1')) {
            redirectVar = <Redirect to="/login" />
        }
        console.log(cookie);
        console.log(this.state);
        if (this.state.updated == true) {
            this.setState({
                updated: false
            })
            redirectVar = <Redirect to="/companyJobs" />
        }

        // let contents;
        // if (this.state.tab == "jobs") {
        //     contents = this.renderJobs();
        // } else {
        //     contents = this.renderApps();
        // }

        return (
            <div>
                {redirectVar}
                <div class="container">

                    <div class="login-form">
                        <div class="main-div">
                            <div class="panel">
                                <h2>Create a Jop posting</h2>
                                <p></p>
                            </div>

                            <div class="form-group">
                                <input onChange={this.titleChangeHandler} type="text" class="form-control" name="title" placeholder="Job Title" />
                            </div>
                            <div className="form-row ">
                                <div className="form-group col-md-9">
                                    <select className="form-control" style={{ width: "100%" }} type="text" placeholder="Category" onChange={this.categoryChangeHandler}>
                                        <option style={{ color: "#ccc", }} value="" hidden></option>
                                        <option value="full-time">Full-Time</option>
                                        <option value="part-time">Part-Time</option>
                                        <option value="internship">Internship</option>
                                        <option value="on Campus">On Campus</option>
                                       
                                    </select><br />
                                </div>
                            </div>

                            
                            <div class='form-group'>

                                <input onChange={this.descriptionChangeHandler} type="text" class="form-control" name="description" placeholder="description" />
                            </div>
                            <div class='form-group'>
                                <input onChange={this.contactinfoChangeHandler} type="text" class="form-control" name="contactinfo" placeholder="Enter your Contact Details" />
                            </div>
                            <div class='form-group'>
                                <input onChange={this.locationChangeHandler} type="tel" class="form-control" name="location" placeholder="Location" />
                            </div>
                            <button onClick={this.submitJob} class="btn btn-primary">Create Job Posting</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default CreateJob;
