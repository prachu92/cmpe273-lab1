import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';

class StudentEvents extends Component {
    constructor() {
        super();
        this.state = {

            isLoading: true,
            events: [{}],
            selected: -1,
            registered: -1,
            resumePath: "",
            registeredEvents: [{}],
            search: "",
            category: "internship",
            showRegistered: false,
        }
        this.createeventsTable = this.createEventsTable.bind(this);
        this.createRegisteredevents = this.createRegisteredevents.bind(this)
        this.renderEvents = this.renderEvents.bind(this);
        this.renderRegisteredEvents = this.renderRegisteredEvents.bind(this);
        this.getRegisteredEvents = this.getRegisteredEvents.bind(this);

        this.registerHandler = this.registerHandler.bind(this);
        this.searchEventsHandler = this.searchEventsHandler.bind(this);
        this.searchChangeHandler = this.searchChangeHandler.bind(this);

    }



    componentDidMount() {
        axios.get('http://localhost:3001/handshake/eventlist')
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
            children.push(<div>{events[i].time}</div>);
            children.push(<div>{events[i].date}</div>);
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

    getRegisteredEvents = () => {
        if (this.state.showRegistered == false) {
        axios.get('http://localhost:3001/handshake/registeredevents')
            .then((response) => {
                console.log('Response data' + response.data);

                this.setState({
                    registeredEvents: response.data,
                    showRegistered: true,
                });
            });
        } else {
            this.setState({
                showRegistered: false,
            })
        }
    }

    createRegisteredevents = () => {
        let registeredEvents = this.state.registeredEvents;
        let table = [];
        if (this.state.showRegistered == false) {
            return table;
        }

        for (let i = 0; i < registeredEvents.length; i++) {
            let children = [];

            children.push(<div>{registeredEvents[i].eventName}</div>);
            children.push(<div>{registeredEvents[i].date}</div>);
            children.push(<div>{registeredEvents[i].time}</div>);

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


    registerHandler = (e) => {
        
        console.log(this.state);
     
        console.log(this.state.events[this.state.selected].eventID);

        // const data = {
        //     jobID: this.state.jobs[this.state.selected].jobID,
        //     // applicationDate: new Date().,
        //     applicationStatus: 0,
        //     resumePath: this.state.resumePath
        // }
        const data={
            eventID: this.state.events[this.state.selected].eventID,
        }
        // data.append('eventID', this.state.events[this.state.selected].eventID);
        
        console.log("Sending data: " + data.toString());
        var link = "http://localhost:3001/handshake/registerevent";
        axios.post(link, data)
            .then(response => {
                console.log("Status Code : ", response.status);
                if (response.status === 200) {
                    this.setState({
                        registered: 1
                    });
                    console.log("event applied" + response);
                } else {
                    this.setState({
                        registered: -1
                    })
                    alert("Not eligible");
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


    searchEventsHandler = (e) => {
        var headers = new Headers();
        //prevent page from refresh
        e.preventDefault();
        const data = {
            query: this.state.search,

        }
        console.log("submit search");
        console.log(data);

        //set the with credentials to true
        axios.defaults.withCredentials = true;
        //make a post request with the user data

        var link = "http://localhost:3001/handshake/eventsearch";

        axios.post(link, data)
            .then(response => {
                console.log("Status Code : ", response.status);
                this.setState({
                    events: response.data,
                    selected: -1,
                })
                if (response.status != 200) {
                    console.log("search failed");
                }
            });
    }

    renderEvents = () => {
        if (this.state.showRegistered)
            return "";

        let description = "";
        let apply = "";

        if (this.state.registered == -1 && this.state.selected >= 0) {
            description = this.state.events[this.state.selected].description;
            apply = <button onClick={this.registerHandler} class="btn btn-primary">Register</button>;

        } else if (this.state.selected >= 0) {
            description = this.state.events[this.state.selected].description;
            apply = "Registered Successfully"
        }
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
                            <span class="rectblock">
                                <div>{description}</div>
                               
                                {apply}
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }

    renderRegisteredEvents = () => {
        return (

            <table>
                <tbody>
                    <tr>
                        <td>
                            <div>
                                {/* <span class="rectblock"> */}
                                <table> <tbody>
                                    {this.createRegisteredevents()}
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



        return (
            <div>
                {redirectVar}

                <div>
                    <input type="text" onChange={this.searchChangeHandler}></input>
                    <span class="fa fa-search" onClick={this.searchEventsHandler}>Search</span>
                </div>
                <div>
                    <ul class="nav navbar-nav navbar-right">
                        <li><span onClick={() => { this.getRegisteredEvents() }} style={{ marginRight: '40px' }}> Registered Events</span> </li>
                    </ul>

                </div>

                {this.renderEvents()}
                {this.renderRegisteredEvents()}
            </div>
        );
    }
}
export default StudentEvents;
