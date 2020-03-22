import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';

class StudentProfile extends Component {
    constructor() {
        super();
        this.state = {
            name: "",
            collegeName: "",
            city: "",
            state: "",
            country: "",
            phoneNo: "",
            careerObj: "",
            college: "",
            location: "",
            degree: "",
            major: "",
            yop: 0,
            cgpa: 0.0,
            company: "",
            location: "",
            title: "",
            startDate: "",
            endDate: "",
        }
    }
    componentDidMount() {
        axios.get('http://localhost:3001/handshake/student/')
            .then((response) => {
                console.log('Response data' + response.data);

                //update the state with the response data
                this.setState({
                    name: response.data[0]['name'],
                    collegeName: response.data[0]['collegeName'],
                    city: response.data[0]['city'],
                    state: response.data[0]['state'],
                    country: response.data[0]['country'],
                    phoneNo: response.data[0]['phoneNo'],
                    careerObj: response.data[0]['careerObj'],
                    college: response.data[0]['college'],
                    location: response.data[0]['location'],
                    degree: response.data[0]['degree'],
                    major: response.data[0]['major'],
                    yop: response.data[0]['yop'],
                    cgpa: response.data[0]['cgpa'],
                    company: response.data[0]['company'],
                    location: response.data[0]['location'],
                    title: response.data[0]['title'],
                    startDate: response.data[0]['startDate'],
                    endDate: response.data[0]['endDate'],

                });
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
        return (
            <div>
                {redirectVar}
                <div>
                    <div>
                        <span class="block">
                            <div>{this.state.name}</div>
                            <div>{this.state.collegeName}</div>
                        </span>
                    </div>
                     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <div>
                        <span class="rectblock">
                            <a href="/updateCareerObj">
                                <div align="right"><span class="glyphicon glyphicon-edit"></span></div>
                            </a>
                            <div>Career Objective</div>
                            <div>{this.state.careerObj}</div>
                        </span>
                    </div>

                </div>
                <br></br>
                <div>
                    <span class="block">
                        <a href="/updateProfile">
                            <div align="right"><span class="glyphicon glyphicon-edit"></span></div>
                        </a>
                        <div>{this.state.city}</div>
                        <div>{this.state.state}</div>
                        <div>{this.state.country}</div>
                        <div>{this.state.phoneNo}</div>

                    </span>
                </div>
                <div>

                    <span class="rectblock">
                        <a href="/updateEducation">
                            <div align="right"><span class="glyphicon glyphicon-edit"></span></div>
                        </a>
                        <div>Education Details</div>
                        <div>{this.state.college}</div>
                        <div>{this.state.location}</div>
                        <div>{this.state.degree}</div>
                        <div>{this.state.major}</div>
                        <div>{this.state.yop}</div>
                        <div>{this.state.cgpa}</div>

                    </span>

                </div>


                <div>

                    <span class="rectblock">
                        <a href="/updateExperience">
                            <div align="right"><span class="glyphicon glyphicon-edit"></span></div>
                        </a>
                        <div>Experience Details</div>
                        <div>{this.state.company}</div>
                        <div>{this.state.location}</div>
                        <div>{this.state.title}</div>
                        <div>{this.state.startDate}</div>
                        <div>{this.state.endDate}</div>
                       
                    </span>

                </div>
            </div >
        );
    }
}
export default StudentProfile;
