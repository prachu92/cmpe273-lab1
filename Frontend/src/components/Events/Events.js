import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';

class Events extends Component {
    constructor() {
        super();
    }
    render() {
        var redirectVar = null;
        console.log(cookie.load('cookie1'));
        if (!cookie.load('cookie1')) {
            redirectVar = <Redirect to="/login" />
        }

        if (cookie.load('cookie1') == "studentcookie") {
            redirectVar = <Redirect to="/studentEvents" />
        }
        else if (cookie.load('cookie1') == "companycookie") {
            redirectVar = <Redirect to="/companyEvents" />
        }
        console.log(cookie);


        return (
            <div>
                {redirectVar}
            </div>
        );
    }
}

export default Events;