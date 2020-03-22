import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';

class CompanyProfile extends Component {
    constructor() {
        super();
        this.state = {
            name: "",
            location: "",
            contactinfo: "",
            description: "",
            profilepic: "",
        }
    }
    componentDidMount() {
        axios.get('http://localhost:3001/handshake/company/')
            .then((response) => {
                console.log('Response data' + response.data);

                //update the state with the response data
                this.setState({
                    name: response.data[0]['name'],
                    location: response.data[0]['location'],
                    contactinfo: response.data[0]['contactinfo'],
                    description: response.data[0]['description'],
                    profilepic: response.data[0]['profilepic'],
                    

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

                    <span class="rectblock">
                        <a href="/updateCompanyProfile">
                            <div align="right"><span class="glyphicon glyphicon-edit"></span></div>
                        </a>
                        <div>{this.state.profilepic}</div>
                        <div>{this.state.name}</div>
                        <div>{this.state.location}</div>
                        <div>{this.state.contactinfo}</div>
                        <div>{this.state.description}</div>
                        
                    </span>

                </div>
            </div >
        );
    }
}
export default CompanyProfile;
