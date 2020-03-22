import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import {Link} from 'react-router-dom';

class CompanyEvents extends Component {
    constructor() {
        super();
        this.state = {
            
            isLoading: true,
            events: [{}],
            selected: -1,
            accepted: -1,
            resumePath: "",
            applicants: [],
        }
        this.createEventsTable = this.createEventsTable.bind(this);
        this.renderJobs = this.renderJobs.bind(this);
        this.findRegistrations = this.findRegistrations.bind(this);
        this.createRegistrationsTable = this.createRegistrationsTable.bind(this);
        this.viewProfile = this.viewProfile.bind(this);

    }



    componentDidMount() {
        axios.get('http://localhost:3001/handshake/companyeventlist')
            .then((response) => {
                console.log('Response data' + response.data);

                //update the state with the response data
                this.setState({
                    events: response.data,
                    isLoading: false,
                    selected: -1,
                });
            });

    }


    createEventsTable = () => {
        let events = this.state.events;
        let table = [];

        for (let i = 0; i < events.length; i++) {
            let children = [];
            children.push(<div>{events[i].eventName}</div>);
            children.push(<div>{events[i].location}</div>);
            children.push(<div>{events[i].date}</div>);
            children.push(<div>{events[i].time}</div>);
            let cls = "rectblock";
            if (i === this.state.selected) {
                console.log("Selected");
                cls = "rectblockselected";
            }
            table.push(
                <tr key={i.toString()}>
                    <span class={cls} onClick={() => this.setState({ selected: i })}>
                        {children}
                    </span>
                </tr>
            );
        }
        return table;
    }

    findRegistrations = () => {
        let i = this.state.selected;
        // this.setState({ selected: i });

        const data = {
            eventID: this.state.events[i].eventID
        }

        console.log("list of students for event  " + this.state.events[i].eventID);
        console.log(data);

        //set the with credentials to true
        axios.defaults.withCredentials = true;
        //make a post request with the user data

        var link = "http://localhost:3001/handshake/registeredstudents";

        axios.post(link, data)
            .then(response => {
                console.log("Status Code : ", response.status + " response data  ", response.data);
                this.setState({
                    applicants: response.data,
                })
                if (response.status != 200) {
                    console.log("search failed");
                }
            }, (error) => {
                console.log(error);
            });

    }

    viewProfile = (i) => {

        var link = "http://localhost:3001/handshake/acceptapplicant";

        const data = {
            studentID: (this.state.applicants)[i].studentID,
            jobID: (this.state.applicants)[i].jobID,
        }
        axios.post(link, data)
            .then(response => {
                console.log("Status Code : ", response.status + " response data  ", response.data);
                this.setState({
                    accepted: 1,
                    
                })
                if (response.status != 200) {
                    console.log("update failed");
                }
            }, (error) => {
                console.log(error);
            });
    }

    createRegistrationsTable = () => {
        if (this.state.selected < 0)
            return "";
        let applicants = this.state.applicants;
        let table = [];
        let accept = "";

       
        for (let i = 0; i < applicants.length; i++) {
            let children = [];
            

           
            accept = <button onClick={() => {this.viewProfile()}} class="btn btn-primary"> View Profile </button>;
            


            console.log("applicants info " + applicants[i].name)
            
            
            children.push(<div>{applicants[i].name}</div>);
            children.push(<div>{applicants[i].collegeName}</div>);
            
           
            
            children.push(<div>{accept}</div>)
            
            let cls = "rectblock";
            
            table.push(
                <tr key={i.toString()}>
                    <span class={cls}>
                        {children}
                    </span>
                </tr>
            );
        }
        return table;
    }

   

    renderJobs = () => {
        let jobApplicants = "";
        let applicants = "";
        if (this.state.selected >= 0) {
            jobApplicants = <button onClick={() => this.findRegistrations()} class="btn btn-primary">View Registrations</button>;
            if (this.state.applicants.length > 0) {
                applicants = this.createRegistrationsTable();
            }
        }
        console.log(this.state.selected);
        console.log(applicants);
        return (

            <table>
                <tbody>
                    <tr>
                        <td>
                            <div>
                                {/* <span class="rectblock"> */}
                                <table> <tbody>
                                    {this.createEventsTable()}
                                </tbody> </table>

                                {/* </span> */}

                            </div>
                        </td>
                        <td>

                            <div> <table> <tbody>
                                <tr>
                                    {jobApplicants}
                                </tr>
                                <tr>
                                    {applicants}
                                </tr>
                            </tbody> </table></div>

                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }

    renderApps = () => {
        let description = "";
        let apply = "";
        let upload = "";
        // if (this.state.applied == -1 && this.state.selected >= 0) {
        //     description = this.state.jobs[this.state.selected].description;
        //     apply = <button onClick={this.applyHandler} class="btn btn-primary">Apply</button>;
        //     upload = <input onChange={this.resumePathChangeHandler} type="file" />
        // } else if (this.state.selected >= 0) {
        //     description = this.state.jobs[this.state.selected].description;
        //     upload = "Application submitted!"
        // }
        return (

            <table>
                <tbody>
                    <tr>
                        <td>
                            <div>
                                {/* <span class="rectblock"> */}
                                <table> <tbody>
                                    {this.createApplicationsTable()}
                                </tbody> </table>

                                {/* </span> */}

                            </div>
                        </td>
                        {/* <td>
                            <span class="rectblock">
                                <div>{description}</div>
                                {upload}
                                {apply}
                            </span>
                        </td> */}
                    </tr>
                </tbody>
            </table>
        );
    }

    render() {
        var redirectVar = null;
        console.log(cookie.load('cookie1'));
        if (!cookie.load('cookie1')) {
            redirectVar = <Redirect to="/login" />
        }
        console.log(cookie);
        console.log(this.state);

        // let contents;
        // if (this.state.tab == "jobs") {
        //     contents = this.renderJobs();
        // } else {
        //     contents = this.renderApps();
        // }

        return (
            <div>
                {redirectVar}


                <div>
                    <ul class="nav navbar-nav navbar-right">
                        <li><Link to="/createEvent"><span style={{ marginRight: '40px' }}></span> Create Event</Link></li>
                    </ul>
                </div>
                {this.renderJobs()}
            </div>
        );
    }
}
export default CompanyEvents;