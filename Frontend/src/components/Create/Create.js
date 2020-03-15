import React, {Component} from 'react';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import axios from 'axios';

class Create extends Component{
    constructor(props) {
        super(props);
        this.state = {
            bookid: "",
            title: "",
            author: "",
            added: false,
        };
        this.bookidChangeHandler = this.bookidChangeHandler.bind(this);
        this.titleChangeHandler = this.titleChangeHandler.bind(this);
        this.authorChangeHandler = this.authorChangeHandler.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
    }

    bookidChangeHandler = (e) => {
        this.setState({
            bookid : e.target.value
        })
    }

    titleChangeHandler = (e) => {
        this.setState({
            title : e.target.value
        })
    }

    authorChangeHandler = (e) => {
        this.setState({
            author : e.target.value
        })
    }

    submitHandler = (e) => {
        var headers = new Headers();
        //prevent page from refresh
        e.preventDefault();
        const data = {
            bookid : this.state.bookid,
            title : this.state.title,
            author : this.state.author
        }
        console.log("submit add book")
        axios.post('http://localhost:3001/create',data)
        .then(response => {
            console.log("Status Code : ", response.status);
            if(response.status === 200){
                this.setState({
                    bookid: "",
                    title: "",
                    author: "",
                    added: true,
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
          } else if (this.state.added) {
            this.setState({
                added: false
            })
            redirectVar = <Redirect to="/home/" />
          }
        return(
            <div>
                {redirectVar} 
                <br/>
                <div class="container">

                <div class="form-group">
                    <input onChange = {this.bookidChangeHandler} type="text" class="form-control" name="bookid" placeholder="Book ID"/>
                </div>
                <div class="form-group">
                    <input onChange = {this.titleChangeHandler} type="text" class="form-control" name="title" placeholder="Book Title"/>
                </div>
                <div class="form-group">
                    <input onChange = {this.authorChangeHandler} type="text" class="form-control" name="author" placeholder="Book Author"/>
                </div>
                <button onClick = {this.submitHandler} class="btn btn-primary">Create</button>                 


                    {/* <form action="http://localhost:3001/create" method="post">
                        <div style={{width: '30%'}} class="form-group">
                            <input  type="text" class="form-control" name="bookid" placeholder="Book ID"/>
                        </div>
                        <br/>
                        <div style={{width: '30%'}} class="form-group">
                                <input  type="text" class="form-control" name="title" placeholder="Book Title"/>
                        </div>
                        <br/>
                        <div style={{width: '30%'}} class="form-group">
                                <input  type="text" class="form-control" name="author" placeholder="Book Author"/>
                        </div>
                        <br/>
                        <div style={{width: '30%'}}>
                            <button class="btn btn-success" type="submit">Create</button>
                        </div> 
                    </form> */}
                </div>
            </div>
        )
    }
}

export default Create;