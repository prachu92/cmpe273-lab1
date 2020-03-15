import React, {Component} from 'react';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import axios from 'axios';

class Delete extends Component{

    constructor(props) {
        super(props);
        this.state = {
            bookid: "",
            deleted: false,
        };
        this.bookidChangeHandler = this.bookidChangeHandler.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
    }

    bookidChangeHandler = (e) => {
        this.setState({
            bookid : e.target.value
        })
    }

    submitHandler = (e) => {
        var headers = new Headers();
        //prevent page from refresh
        e.preventDefault();
        const data = {
            bookid : this.state.bookid,
        }
        console.log("submit delete book")
        axios.post('http://localhost:3001/delete',data)
        .then(response => {
            console.log("Status Code : ", response.status);
            if(response.status === 200){
                this.setState({
                    bookid: "",
                    deleted: true,
                })
            }else{
                console.log(response.data);
                alert(response.data);
            }
            console.log("");
        });
    }


    render(){
         //if not logged in go to login page
         let redirectVar = null;
         if(!cookie.load('cookie')){
             redirectVar = <Redirect to= "/login"/>
         } else if (this.state.deleted) {
             this.setState({
                 deleted: false
             })
             redirectVar = <Redirect to="/home/"/>;
         }
        return(
            <div>
                 {redirectVar}
            <div class="container">

                <div class="form-group">
                    <input onChange = {this.bookidChangeHandler} type="text" class="form-control" name="bookid" placeholder="Book ID"/>
                </div>
                <button onClick = {this.submitHandler} class="btn btn-primary">Delete</button>                 


                {/* <form>
                    <div style={{width: "50%",float: "left"}} class="form-group">
                        <input  type="text" class="form-control" name="BookID" placeholder="Search a Book by Book ID"/>
                    </div>
                    <div style={{width: "50%", float: "right"}}>
                            <button class="btn btn-success" type="submit">Delete</button>
                    </div> 
                </form> */}
            </div>
            </div>
        )
    }
}

export default Delete;