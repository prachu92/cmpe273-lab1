import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';


class CreateEvents extends Component {
    constructor() {
        super();
        this.state = {
            eventName: "",
            time: "",
            date: "",
            description: "",
            location: "",
            eligibility: false,
            authFlag: false,
        }
        this.eventNameChangeHandler = this.eventNameChangeHandler.bind(this);
        this.timeChangeHandler = this.timeChangeHandler.bind(this);
        this.dateChangeHandler = this.dateChangeHandler.bind(this);
        this.descriptionChangeHandler = this.descriptionChangeHandler.bind(this)
        this.locationChangeHandler = this.locationChangeHandler.bind(this);
        this.eligibilityChangeHandler = this.eligibilityChangeHandler.bind(this);
        this.submitEvent = this.submitEvent.bind(this);


    }

    //Call the Will Mount to set the auth Flag to false
    componentWillMount() {
        this.setState({
            authFlag: false
        })
    }

    eventNameChangeHandler = (e) => {
        this.setState({
            eventName: e.target.value
        })
    }
    //city change handler to update state variable with the text entered by the user
    timeChangeHandler = (e) => {
        this.setState({
            time: e.target.value
        })
    }
    //state change handler to update state variable with the text entered by the user
    dateChangeHandler = (e) => {
        this.setState({
            date: e.target.value
        })
    }

    descriptionChangeHandler = (e) => {
        this.setState({
            description: e.target.value
        })
    }

    locationChangeHandler = (e) => {
        this.setState({
            location: e.target.value
        })
    }

    eligibilityChangeHandler = (e) => {
        this.setState({
            eligibility: e.target.value
        })
    }

    //submit Login handler to send a request to the node backend
    submitEvent = (e) => {
        var headers = new Headers();
        //prevent page from refresh
        e.preventDefault();
        const data = {
            eventName: this.state.eventName,
            time: this.state.time,
            date: this.state.date,
            description: this.state.description,
            eligibility: this.state.eligibility,
            location: this.state.location
        }
        console.log("submit event " + data)

        //set the with credentials to true
        axios.defaults.withCredentials = true;
        //make a post request with the user data

        var link = "http://localhost:3001/handshake/createevent";

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
                    alert(" event creation failed.");
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
            redirectVar = <Redirect to="/companyEvents" />
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
                                <h2>Create a Event</h2>
                                <p></p>
                            </div>

                            <div class="form-group">
                                <input onChange={this.eventNameChangeHandler} type="text" class="form-control" name="eventName" placeholder="Event Name" />
                            </div>
                                                       
                            <div class='form-group'>

                                <input onChange={this.descriptionChangeHandler} type="text" class="form-control" name="description" placeholder="description" />
                            </div>
                            
                            <div class='form-group'>
                                <input onChange={this.dateChangeHandler} type="date" class="form-control" name="date" placeholder="Enter event date" />
                            </div>
                            <div class='form-group'>
                                <input onChange={this.timeChangeHandler} type="time" class="form-control" name="time" placeholder="Enter event time" />
                            </div>

                            <div class='form-group'>
                                <input onChange={this.locationChangeHandler} type="text" class="form-control" name="location" placeholder="Location" />
                            </div>
                            <div class='form-group'>
                                <input onChange={this.eligibilityChangeHandler} type="text" class="form-control" name="eligibility" placeholder="Enter Eligibility criteria" />
                            </div>
                            <button onClick={this.submitEvent} class="btn btn-primary">Create Event</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default CreateEvents;