import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
// import { Document, Page } from 'react-pdf/dist/entry.parcel';
// import { pdfjs } from 'react-pdf';
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

class CompanyJobs extends Component {
    constructor() {
        super();
        this.state = {
            tab: "jobs",
            isLoading: true,
            jobs: [{}],
            selected: -1,
            accepted: -1,
            resumePath: "",
            applicants: [],
        }
        this.createJobsTable = this.createJobsTable.bind(this);
        this.renderJobs = this.renderJobs.bind(this);
        this.resumePathChangeHandler = this.resumePathChangeHandler.bind(this);
        this.createApplicantsTable = this.createApplicantsTable.bind(this);
        this.acceptApplicant = this.acceptApplicant.bind(this);

    }



    componentDidMount() {
        axios.get('http://localhost:3001/handshake/companyjoblist')
            .then((response) => {
                console.log('Response data' + response.data);

                //update the state with the response data
                this.setState({
                    jobs: response.data,
                    isLoading: false,
                    selected: -1,
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

    findApplicants = () => {
        let i = this.state.selected;
        // this.setState({ selected: i });

        const data = {
            jobID: this.state.jobs[i].jobID
        }

        console.log("list of applicants for job  " + this.state.jobs[i].jobID);
        console.log(data);

        //set the with credentials to true
        axios.defaults.withCredentials = true;
        //make a post request with the user data

        var link = "http://localhost:3001/handshake/jobapplicants";

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

    acceptApplicant = (i) => {

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

    createApplicantsTable = () => {
        if (this.state.selected < 0)
            return "";
        let applicants = this.state.applicants;
        let table = [];
        let accept = "";

       
        for (let i = 0; i < applicants.length; i++) {
            let children = [];
            var appStatus = "";

            if(this.state.accepted == -1)
            {
                accept = <button onClick={() => {this.acceptApplicant(i)}} class="btn btn-primary"> Review </button>;
            }
            else{
                accept = "";
            }


            console.log("applicants info " + applicants[i].name)
            if (applicants[i].applicationStatus === 0) {
                appStatus = "Application Status: Pending";
            }
            else if (applicants[i].applicationStatus === 1) {
                appStatus = "Application Status: Reviewed";
            }
            else {
                appStatus = "Application Status: Rejected";
            }
            let viewRes = "";
            if (this.state.viewResume) {
                console.log('localhost:3001/uploads/' + applicants[i].resumePath);
                // viewRes = <Document
                //     file={"http://localhost:3001/uploads/" + applicants[i].resumePath}     
                //     onLoadError={console.error}
                //     // onLoadSuccess={this.onDocumentLoadSuccess}
                //     >
                //     {/* <Page pageNumber={pageNumber} /> */}
                // </Document>
                    // <PDFViewer
                    //     document={{
                    //         url: 'localhost:3001/uploads/' + applicants[i].resumePath,
                    //     }}
                    // />;
            }
            children.push(<div>{applicants[i].name}</div>);
            children.push(<div>{applicants[i].collegeName}</div>);
            children.push(<div>{appStatus}</div>);
            children.push(<div>Application Date:{applicants[i].applicationDate}</div>);
            // children.push(<div onClick={() => { this.setState({ viewResume: true }) }}>View Resume</div>);
            children.push(<div><a href={'localhost:3001/uploads/' + applicants[i].resumePath}>View Resume</a></div>);
            //children.push(<div onClick={() => {this.acceptApplicant()}}> Accept </div>);
            children.push(<div>{accept}</div>)
            children.push(<div>{viewRes}</div>);

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

    renderJobs = () => {
        let jobApplicants = "";
        let applicants = "";
        if (this.state.selected >= 0) {
            jobApplicants = <button onClick={() => this.findApplicants()} class="btn btn-primary">View Applicants</button>;
            if (this.state.applicants.length > 0) {
                applicants = this.createApplicantsTable();
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
                                    {this.createJobsTable()}
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
                        <li><Link to="/createJobs"><span style={{ marginRight: '40px' }}></span> Create Jobs</Link></li>
                    </ul>
                </div>
                {this.renderJobs()}
            </div>
        );
    }
}
export default CompanyJobs;
