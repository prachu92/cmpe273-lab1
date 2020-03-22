import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';

class StudentJobs extends Component {
    constructor() {
        super();
        this.state = {
            tab: "jobs",
            isLoading: true,
            jobs: [{}],
            selected: -1,
            applied: -1,
            resumePath: "",
            applications: [{}],
            search: "",
            category: "internship",
        }
        this.createJobsTable = this.createJobsTable.bind(this);
        this.createApplicationsTable = this.createApplicationsTable.bind(this)
        this.renderJobs = this.renderJobs.bind(this);
        this.renderApps = this.renderApps.bind(this);
        this.resumePathChangeHandler = this.resumePathChangeHandler.bind(this);
        this.applyHandler = this.applyHandler.bind(this);
        this.searchJobsHandler = this.searchJobsHandler.bind(this);
        this.searchChangeHandler = this.searchChangeHandler.bind(this);
        this.categoryChangeHandler = this.categoryChangeHandler.bind(this);
    }



    componentDidMount() {
        axios.get('http://localhost:3001/handshake/joblist')
            .then((response) => {
                console.log('Response data' + response.data);

                //update the state with the response data
                this.setState({
                    jobs: response.data,
                    isLoading: false,
                    selected: -1,
                });
            });

            axios.get('http://localhost:3001/handshake/appliedjobs')
            .then((response) => {
                console.log('Response data' + response.data);

                this.setState({
                    applications: response.data,
                });
            });
    }

    createJobsTable = () => {
        let jobs = this.state.jobs;
        let table = [];

        for (let i = 0; i < jobs.length; i++) {
            let children = [];
            children.push(<div>{jobs[i].title}</div>);
            children.push(<div>{jobs[i].location}</div>);
            children.push(<div>{jobs[i].contactInfo}</div>);
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

    createApplicationsTable = () => {
        let applications = this.state.applications;
        let table = [];

        for (let i = 0; i < applications.length; i++) {
            let children = [];
            var appStatus = "";
            if(applications[i].applicationStatus === 0)
            {
                appStatus = "Application Status: Pending";
            }
            else if(applications[i].applicationStatus === 1){
                appStatus = "Application Status: Accepted";
            }
            else{
                appStatus = "Application Status: Rejected";
            }
            children.push(<div>{applications[i].title}</div>);
            children.push(<div>{applications[i].location}</div>);
            children.push(<div>{appStatus}</div>);
            children.push(<div>Application Date:{applications[i].applicationDate}</div>)
            let cls = "rectblock";
            // if (i === this.state.selected) {
            //     console.log("Selected");
            //     cls = "rectblockselected";
            // }
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

    resumePathChangeHandler = (e) => {
        console.log(e);
        this.setState({
            resumePath: e.target.files[0]
        });
        console.log("Uploaded: " + this.state.resumePath);
    }

    applyHandler = (e) => {
        if (this.state.resumePath.length == 0) {
            alert("Upload resume");
        }
        console.log(this.state);
        console.log(this.state.jobs[this.state.selected]);
        console.log(this.state.jobs[this.state.selected].jobID);

        // const data = {
        //     jobID: this.state.jobs[this.state.selected].jobID,
        //     // applicationDate: new Date().,
        //     applicationStatus: 0,
        //     resumePath: this.state.resumePath
        // }
        const data = new FormData();
        data.append('jobID', this.state.jobs[this.state.selected].jobID);
        data.append('applicationStatus', 0);
        data.append('resumePath', this.state.resumePath);

        console.log("Sending data: " + data.toString());
        var link = "http://localhost:3001/handshake/applyjob";
        axios.post(link, data)
        .then(response => {
            console.log("Status Code : ", response.status);
            if (response.status === 200) {
                this.setState({
                    applied: 1                    
                });
                console.log("Job applied" + response);
            } else {
                this.setState({
                    applied: -1
                })
                alert("Job application failed.");
            }
        });

        // axios.post(link, data)
        //     .then(response => {
        //         if (response.status === 200) {
        //             response.json().then((body) => {
        //                 this.setState({ applied: 1 });
        //             });
        //             console.log("Applied" + response);
        //         } else {

        //         }
        //     }
    }

    searchChangeHandler = (e) => {
        this.setState({
            search: e.target.value
        })
    }

    categoryChangeHandler = (e) => {
        this.setState({
            category: e.target.value
        })
    }

    searchJobsHandler = (e) =>{
        var headers = new Headers();
        //prevent page from refresh
        e.preventDefault();
        const data = {
            query: this.state.search,
            category: this.state.category,
        }
        console.log("submit search");
        console.log(data);

        //set the with credentials to true
        axios.defaults.withCredentials = true;
        //make a post request with the user data

        var link = "http://localhost:3001/handshake/jobsearch";

        axios.post(link, data)
            .then(response => {
                console.log("Status Code : ", response.status);
                this.setState({
                    jobs: response.data,
                    selected: -1,
                })
                if (response.status != 200) {
                    console.log("search failed");
                }
            });
    }

    renderJobs = () => {
        let description = "";
        let apply = "";
        let upload = "";
        if (this.state.applied == -1 && this.state.selected >= 0) {
            description = this.state.jobs[this.state.selected].description;
            apply = <button onClick={this.applyHandler} class="btn btn-primary">Apply</button>;
            upload = <input onChange={this.resumePathChangeHandler} type="file" />
        } else if (this.state.selected >= 0) {
            description = this.state.jobs[this.state.selected].description;
            upload = "Application submitted!"
        }
        return (

            <table>
                <tbody>
                    <tr>
                        <td>
                            <div>
                                {/* <span class="rectblock"> */}
                                <table> <tbody>
                                    {this.createJobsTable()}
                                </tbody> </table>

                                {/* </span> */}

                            </div>
                        </td>
                        <td>
                            <span class="rectblock">
                                <div>{description}</div>
                                {upload}
                                {apply}
                            </span>
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
        let filter = "";
       
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
                        <td>

                            <div> <table> <tbody>
                                <tr>
                            <label for="status">Choose Criteria:</label>

                            <select id="status">
                            <option value="Pending">Pending</option>
                            <option value="Reviewed">Reviewed</option>
                            <option value="rejected">Rejected</option>

                            </select>
                            <button onClick={() => this.findApplicantsBasedOnCriteria()} class="btn btn-primary">Go</button>;
                                    {filter}
                                </tr>
                                
                            </tbody> </table></div>

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

        let contents;
        if (this.state.tab == "jobs") {
            contents = this.renderJobs();
        } else {
            contents = this.renderApps();
        }

        return (
            <div>
                {redirectVar}

                <div>
                    <input type="text" onChange={this.searchChangeHandler}></input>
                    <span class="fa fa-search" onClick= {this.searchJobsHandler}>Search</span>
                    <label> <input onChange={this.categoryChangeHandler} type="radio" value="full-time" checked={this.state.category === "full-time"} /> Full-Time </label>
                    <label> <input onChange={this.categoryChangeHandler} type="radio" value="part-time" checked={this.state.category === "part-time"} /> Part-Time </label>
                    <label> <input onChange={this.categoryChangeHandler} type="radio" value="internship" checked={this.state.category === "internship"} /> Internship </label>
                    <label> <input onChange={this.categoryChangeHandler} type="radio" value="oncampus" checked={this.state.category === "oncampus"} /> On Campus </label>
                </div>
                <div>
                    <ul class="nav navbar-nav navbar-right">
                        <li><span onClick={() => { this.setState({ tab: "jobs" }) }} style={{ marginRight: '40px' }}> Job Search </span> </li>
                        <li><span onClick={() => { this.setState({ tab: "apps" }) }} style={{ marginRight: '40px' }}> Applications </span> </li>
                    </ul>

                </div>

                {contents}
            </div>
        );
    }
}
export default StudentJobs;
