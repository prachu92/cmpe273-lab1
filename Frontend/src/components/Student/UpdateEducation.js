import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';

//Define a Login Component
class UpdateEducation extends Component {
    //call the constructor method
    constructor(props) {
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            college: "",
            location: "",
            degree: "",
            major: "",
            yop: "",
            cgpa: "",
            authFlag: false,
            updated: false,
        }
        //Bind the handlers to this class
        this.collegeChangeHandler = this.collegeChangeHandler.bind(this);
        this.locationChangeHandler = this.locationChangeHandler.bind(this);
        this.degreeChangeHandler = this.degreeChangeHandler.bind(this);
        this.majorChangeHandler = this.majorChangeHandler.bind(this);
        this.yopChangeHandler = this.yopChangeHandler.bind(this);
        this.cgpaChangeHandler = this.cgpaChangeHandler.bind(this);
        
        this.submitEducation = this.submitEducation.bind(this);
    }
    //Call the Will Mount to set the auth Flag to false
    componentWillMount() {
        this.setState({
            authFlag: false
        })
    }

    collegeChangeHandler = (e) => {
        this.setState({
            college: e.target.value
        })
    }

    locationChangeHandler = (e) => {
        this.setState({
            location: e.target.value
        })
    }

    degreeChangeHandler = (e) => {
        this.setState({
            degree: e.target.value
        })
    }

    majorChangeHandler = (e) => {
        this.setState({
            major: e.target.value
        })
    }

    yopChangeHandler = (e) => {
        this.setState({
            yop: e.target.value
        })
    }

    cgpaChangeHandler = (e) => {
        this.setState({
             cgpa: e.target.value
        })
    }


    //submit Login handler to send a request to the node backend
    submitEducation = (e) => {
        var headers = new Headers();
        //prevent page from refresh
        e.preventDefault();
        const data = {
            college: this.state.college,
            location:this.state.location ,
            degree: this.state.degree,
            major: this.state.major,
            yop: this.state.yop,
            cgpa: this.state.cgpa,
        }
        console.log("in submit education")

        //set the with credentials to true
        axios.defaults.withCredentials = true;
        //make a post request with the user data

        var link = "http://localhost:3001/handshake/updateeducation";

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
                    alert(" education updation failed.");
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
                                <h2>Update Education Details</h2>
                            </div>

                            <div class="form-group">
                                <input onChange={this.collegeChangeHandler} type="text" class="form-control" name="college" placeholder="College/School" />
                            </div>
                            <div class="form-group">
                                <input onChange={this.locationChangeHandler} type="text" class="form-control" name="location" placeholder="Location" />
                            </div>
                            <div class="form-group">
                                <input onChange={this.degreeChangeHandler} type="text" class="form-control" name="degree" placeholder="Degree" />
                            </div>
                            <div class="form-group">
                                <input onChange={this.majorChangeHandler} type="text" class="form-control" name="major" placeholder="Major" />
                            </div>
                            <div class="form-group">
                                <input onChange={this.yopChangeHandler} type="number" min="1900" max="2099" step="1" class="form-control" name="yop" placeholder="Year Of Passing" />
                            </div>
                            <div class="form-group">
                                <input onChange={this.cgpaChangeHandler} type="number" step="0.01" class="form-control" name="cgpa" placeholder="CGPA" />
                            </div>
                            <br></br>
                            <button onClick={this.submitEducation} class="btn btn-primary">Update Education Details</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
//export student profile Component
export default UpdateEducation;