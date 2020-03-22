import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';

//Define a Login Component
class UpdateExperience extends Component {
    //call the constructor method
    constructor(props) {
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            company: "",
            location: "",
            title: "",
            startDate: "",
            endDate: "",
            
            authFlag: false,
            updated: false,
        }
        //Bind the handlers to this class
        this.companyChangeHandler = this.companyChangeHandler.bind(this);
        this.locationChangeHandler = this.locationChangeHandler.bind(this);
        this.titleChangeHandler = this.titleChangeHandler.bind(this);
        this.startDateChangeHandler = this.startDateChangeHandler.bind(this);
        this.endDateChangeHandler = this.endDateChangeHandler.bind(this);
        

        this.submitEducation = this.submitEducation.bind(this);
    }
    //Call the Will Mount to set the auth Flag to false
    componentWillMount() {
        this.setState({
            authFlag: false
        })
    }

    companyChangeHandler = (e) => {
        this.setState({
            company: e.target.value
        })
    }

    locationChangeHandler = (e) => {
        this.setState({
            location: e.target.value
        })
    }

    titleChangeHandler = (e) => {
        this.setState({
            title: e.target.value
        })
    }

    startDateChangeHandler = (e) => {
        this.setState({
            startDate: e.target.value
        })
    }

    endDateChangeHandler = (e) => {
        this.setState({
            endDate: e.target.value
        })
    }

   

    //submit Login handler to send a request to the node backend
    submitExperience = (e) => {
        var headers = new Headers();
        //prevent page from refresh
        e.preventDefault();
        const data = {
            company: "",
            title: "",
            location: "",
            startDate: "",
            endDate: "",
        }
        console.log("in submit ex")

        //set the with credentials to true
        axios.defaults.withCredentials = true;
        //make a post request with the user data

        var link = "http://localhost:3001/handshake/updateexperience";

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
                    alert(" ex updation failed.");
                }
            });
    }

    render() {
        //redirect based on successful update
        let redirectVar = null;
        if (!cookie.load('cookie1'))
            redirectVar = <Redirect to="/login" />
        // console.log(cookie);
        // console.log(cookieName);
        if (this.state.updated == true) {
            this.setState({
                updated: false
            })
            redirectVar = <Redirect to="/studentProfile" />
        }

        return (
            <div>
                {redirectVar}
                <div class="container">

                    <div class="login-form">
                        <div class="main-div">
                            <div class="panel">
                                <h2>Update Experience Details</h2>
                            </div>

                            <div class="form-group">
                                <input onChange={this.companyChangeHandler} type="text" class="form-control" name="company" placeholder="Company" />
                            </div>
                            <div class="form-group">
                                <input onChange={this.titleChangeHandler} type="text" class="form-control" name="title" placeholder="Title" />
                            </div>
                            <div class="form-group">
                                <input onChange={this.locationChangeHandler} type="text" class="form-control" name="location" placeholder="Location" />
                            </div>
                            <div class="form-group">
                                <input onChange={this.startDateChangeHandler} type="date" class="form-control" name="startdate" placeholder="Start Date" />
                            </div>
                            <div class="form-group">
                                <input onChange={this.endDateChangeHandler} type="date"  class="form-control" name="enddate" placeholder="End Date" />
                            </div>
                            
                            <br></br>
                            <button onClick={this.submitExperience} class="btn btn-primary">Update Experience Details</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
//export student profile Component
export default UpdateExperience;