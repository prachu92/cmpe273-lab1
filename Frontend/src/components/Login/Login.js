import axios from 'axios';
import React, { Component } from 'react';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import '../../App.css';

//Define a Login Component
class Login extends Component {
    //call the constructor method
    constructor(props) {
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            username: "",
            password: "",
            type: "student",
            authFlag: false
        }
        //Bind the handlers to this class
        this.usernameChangeHandler = this.usernameChangeHandler.bind(this);
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
        this.typeChangeHandler = this.typeChangeHandler.bind(this);
        this.submitLogin = this.submitLogin.bind(this);
    }
    //Call the Will Mount to set the auth Flag to false
    componentWillMount() {
        this.setState({
            authFlag: false
        })
    }
    typeChangeHandler = (e) => {
        this.setState({
            type: e.target.value
        })
    }
    //username change handler to update state variable with the text entered by the user
    usernameChangeHandler = (e) => {
        this.setState({
            username: e.target.value
        })
    }
    //password change handler to update state variable with the text entered by the user
    passwordChangeHandler = (e) => {
        this.setState({
            password: e.target.value
        })
    }
    //submit Login handler to send a request to the node backend
    submitLogin = (e) => {
        var headers = new Headers();
        //prevent page from refresh
        e.preventDefault();
        const data = {
            username: this.state.username,
            password: this.state.password
        }
        console.log("submit login")

        //set the with credentials to true
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        if (this.state.type === "student") {
            var link = "http://localhost:3001/handshake/student_login";
        }
        else if (this.state.type === "company") {
            link = "http://localhost:3001/handshake/company_login";
        }
        axios.post(link, data)
            .then(response => {
                console.log("Status Code : ", response.status);
                if (response.status === 200) {
                    this.setState({
                        authFlag: true
                    })
                } else {
                    this.setState({
                        authFlag: false
                    })
                    alert("Invalid login credentials");
                }
            });
    }

    render() {
        //redirect based on successful login
        let redirectVar = null;
        if (cookie.load('cookie1'))
            var cookieName = cookie.load('cookie1');
        console.log(cookie);
        console.log(cookieName);
        if (cookieName === "studentcookie") {
            redirectVar = <Redirect to="/studentJobs" />
        }
        else if (cookieName === "companycookie") {
            redirectVar = <Redirect to="/companyJobs" />
        }
        return (
            <div>
                {redirectVar}
                <div class="container">

                    <div class="login-form">
                        <div class="main-div">
                            <div class="panel">
                                <h2>Login</h2>
                                <p>Please enter your username and password</p>
                            </div>

                            <div class="form-group">
                                <input onChange={this.usernameChangeHandler} type="text" class="form-control" name="username" placeholder="Username" />
                            </div>
                            <div class="form-group">
                                <input onChange={this.passwordChangeHandler} type="password" class="form-control" name="password" placeholder="Password" />
                            </div>
                            <div class='form-group'>
                                <div className='type'>
                                    <label> <input onChange={this.typeChangeHandler} type="radio" value="student" checked={this.state.type === "student"} /> Student </label>
                                </div>
                                <div className='type'>
                                    <label> <input onChange={this.typeChangeHandler} type="radio" value="company" checked={this.state.type === "company"} /> Company </label>
                                </div>

                            </div>
                            <button onClick={this.submitLogin} class="btn btn-primary">Login</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
//export Login Component
export default Login;