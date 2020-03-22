import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';

//Define a Login Component
class UpdateCareerObjective extends Component {
    //call the constructor method
    constructor(props) {
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            careerObj: "",
            authFlag: false,
            updated: false,
        }
        //Bind the handlers to this class
        this.careerObjChangeHandler = this.careerObjChangeHandler.bind(this);
        this.submitCareerObj = this.submitCareerObj.bind(this);
    }
    //Call the Will Mount to set the auth Flag to false
    componentWillMount() {
        this.setState({
            authFlag: false
        })
    }

    careerObjChangeHandler = (e) => {
        this.setState({
            careerObj: e.target.value
        })
    }
    

    //submit Login handler to send a request to the node backend
    submitCareerObj = (e) => {
        var headers = new Headers();
        //prevent page from refresh
        e.preventDefault();
        const data = {
            careerObj: this.state.careerObj
        }
        console.log("in submit career obj")

        //set the with credentials to true
        axios.defaults.withCredentials = true;
        //make a post request with the user data

        var link = "http://localhost:3001/handshake/updatecareerobjective";

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
                    alert(" career objective updation failed.");
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
                                <h2>Update Career Objective</h2>
                            </div>

                            <div class="long-form-group">
                                <input onChange={this.careerObjChangeHandler} type="text" class="form-control" name="dob" placeholder="Career Objective" />
                            </div>
                            <br></br>
                            <button onClick={this.submitCareerObj} class="btn btn-primary">Update Career Objective</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
//export student profile Component
export default UpdateCareerObjective;