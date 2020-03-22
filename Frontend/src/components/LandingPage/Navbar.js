import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';

//create the Navbar Component
class Navbar extends Component {
    constructor(props){
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
    }
    //handle logout to destroy the cookie
    handleLogout = () => {
        cookie.remove('cookie1', {path: '/'})
        cookie.remove('cookie2', {path: '/'})
        cookie.remove('cookie3', {path: '/'})
        cookie.remove('cookie4', { path: '/' })
        console.log("All cookies removed!")
        window.location = "/login"

        
    }
    render(){
        //if Cookie is set render Logout Button
        let navLogin = null;
        if((cookie.load('cookie1') === "studentcookie" ) || (cookie.load('cookie1') === "companycookie")){
            console.log("Able to read cookie " + cookie.load('cookie1'));
            navLogin = (
                <ul class="nav navbar-nav navbar-right">
                        <li><Link to="/search" onClick = {this.handleSearch}><input type="text"></input><span class="fa fa-search"></span>Search</Link></li>
                        <li><Link to="/" onClick = {this.handleLogout}><span class="glyphicon glyphicon-user"></span>Logout</Link></li>
                </ul>
            );
        }else{
            //Else display login button
             console.log("Not Able to read cookie");
            navLogin = (
                <ul class="nav navbar-nav navbar-right">
                        <li><Link to="/login"><span class="glyphicon glyphicon-log-in"></span> Login</Link></li>
                        <li><Link to="/signup"><span class="glyphicon glyphicon-log-in"></span> Sign Up</Link></li>
                </ul>
            )
         }
        let redirectVar = null;
        // if(cookie.load('cookie')){
        //     redirectVar = <Redirect to="/home"/>
        // }
        return(
            <div>
                {redirectVar}
            <nav class="navbar navbar-inverse">
                <div class="container-fluid">
                    <div class="navbar-header">
                        <a class="navbar-brand">Handshake App</a>
                    </div>
                    <ul class="nav navbar-nav">
                        {/* <li class="active"><Link to="/home">Home</Link></li> */}
                        <li><Link to="/jobs">Jobs</Link></li>
                        <li><Link to="/events">Events</Link></li>
                        <li><Link to="/">Q and A</Link></li>
                        <li><Link to="/students/">Students</Link></li>
                        <li><Link to="/studentProfile">Profile</Link></li>
                        <li><Link to="/">Messages</Link></li>
                        <li><Link to="/">Career Center</Link></li>
                        
                    </ul>
                    {navLogin}
                </div>
            </nav>
        </div>
        )
    }
}

export default Navbar;