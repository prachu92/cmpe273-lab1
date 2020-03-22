import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';

//Define a Login Component
class UpdateStudentProfile extends Component {
    //call the constructor method
    constructor(props) {
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            dob: new Date(),
            city: "",
            state: "",
            country: "",
            profilePic: "",
            phoneNo: 0,
            authFlag: false,
            updated: false,
        }
        //Bind the handlers to this class
        this.dobChangeHandler = this.dobChangeHandler.bind(this);
        this.cityChangeHandler = this.cityChangeHandler.bind(this);
        this.stateChangeHandler = this.stateChangeHandler.bind(this);
        this.countryChangeHandler = this.countryChangeHandler.bind(this);
        this.phoneNoChangeHandler = this.phoneNoChangeHandler.bind(this);
        this.submitprofile = this.submitprofile.bind(this);
    }
    //Call the Will Mount to set the auth Flag to false
    componentWillMount() {
        this.setState({
            authFlag: false
        })
    }

    dobChangeHandler = (e) => {
        this.setState({
            dob: e.target.value
        })
    }
    //city change handler to update state variable with the text entered by the user
    cityChangeHandler = (e) => {
        this.setState({
            city: e.target.value
        })
    }
    //state change handler to update state variable with the text entered by the user
    stateChangeHandler = (e) => {
        this.setState({
            state: e.target.value
        })
    }

    countryChangeHandler = (e) => {
        this.setState({
            country: e.target.value
        })
    }

    phoneNoChangeHandler = (e) => {
        this.setState({
            phoneNo: e.target.value
        })
    }

    //submit Login handler to send a request to the node backend
    submitprofile = (e) => {
        var headers = new Headers();
        //prevent page from refresh
        e.preventDefault();
        const data = {
            dob: this.state.dob,
            city: this.state.city,
            state: this.state.state,
            country: this.state.country,
            phoneNo: this.state.phoneNo
        }
        console.log("submit Profile")

        //set the with credentials to true
        axios.defaults.withCredentials = true;
        //make a post request with the user data

        var link = "http://localhost:3001/handshake/updatestudentprofile";

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
                    alert(" Profile updation failed.");
                }
            });
    }

    render() {
        //redirect based on successful update
        let redirectVar = null;
        if (!cookie.load('cookie1'))
        redirectVar = <Redirect to = "/login"/>
        // console.log(cookie);
        // console.log(cookieName);
        if(this.state.updated == true)
        {
            this.setState({
                updated: false
            })
            redirectVar = <Redirect to = "/studentProfile"/>
        }
        
        return (
            <div>
                {redirectVar}
                <div class="container">

                    <div class="login-form">
                        <div class="main-div">
                            <div class="panel">
                                <h2>Update profile details</h2>
                                <p>Please enter all the fields</p>
                            </div>

                            <div class="form-group">
                                <input onChange={this.dobChangeHandler} type="date" class="form-control" name="dob" placeholder="Date of Birth" />
                            </div>
                            <div class="form-group">
                                <input onChange={this.cityChangeHandler} type="text" class="form-control" name="city" placeholder="City" />
                            </div>
                            <div class='form-group'>

                                <input onChange={this.stateChangeHandler} type="text" class="form-control" name="state" placeholder="state" />
                            </div>
                            <div class='form-group'>
                                <input onChange={this.countryChangeHandler} type="text" class="form-control" name="country" placeholder="country" />
                            </div>
                            <div class='form-group'>
                                <input onChange={this.phoneNoChangeHandler} type="tel" class="form-control" name="phone" placeholder="Mobile Number" />
                            </div>
                            <button onClick={this.submitprofile} class="btn btn-primary">Update Profile</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
//export student profile Component
export default UpdateStudentProfile;