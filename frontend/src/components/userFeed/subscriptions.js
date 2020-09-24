import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import { Link } from "react-router-dom";
import { Redirect } from 'react-router';
import 'bootstrap/dist/css/bootstrap.min.css';
import { faHome, faList } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Favicon from 'react-favicon';
import Navbar from '../navbar'

class Subscriptions extends Component {

    constructor(props) {
        super(props);
        this.state = {
            listsubscriber: []
        }
        
    }
 
    componentDidMount(){
        
        axios.defaults.withCredentials = true;
        axios.get('/lists/subscriptions')
                .then((response) => {
                    console.log(response)
                this.setState({
                    listsubscriber : response.data
                   // profileimage: !response.data.data.tweetImage || response.data.data.tweetImage === 'undefined' ? '/pic.png' : response.data.data.tweetImage
                });
                console.log(response.data)
                this.state.listsubscriber.map(subscribe1 =>{
                    console.log("subsribesss")
                    console.log(subscribe1.tweet._id);
                });
            });
    }



    render() {

        let redirectVar = null;
        if (localStorage.getItem('email') == null) {
            console.log("in cookie if")
            redirectVar = <Redirect to="/login" />
        }
       
        let listsubscriber;
        
        listsubscriber =this.state.listsubscriber.map(subscribe1 =>(
            <Link class="a" to={{pathname:"/sublist", state:[subscribe1.tweet.listName,subscribe1.tweet.listDesc,subscribe1.tweet.members.length,subscribe1.tweet.subscribers.length,subscribe1.tweet._id] }}>
            <div class="tweets-div u-list1">    
                <div class="u-flex u-flex-align">
                            <div class="u-flex-justify">
                            <div class="u-mar1">
                            <div class="s-list-item-primary u-mar1 fullname">{subscribe1.user.results[0].firstName}</div>
                            <div class="s-list-item-primary u-mar1 listheading">{subscribe1.tweet.listName}</div>
                            <div class="s-list-item-secondary u-mar1 snippet">
                                    <span class="span">{subscribe1.tweet.listDesc}</span>
                            </div>
                            <div class="s-list-item-secondary u-mar1 snippet">
                                    <span class="span">{subscribe1.tweet.members.length} Members&nbsp;&nbsp; </span>
                                    <span class="span">{subscribe1.tweet.subscribers.length}Subscribers</span>
                            </div>
                            </div>
                            </div>
                            </div>            
            </div>
            </Link>
            ))

        return (
            <div class="container-flex">
                {redirectVar}
                <Navbar/>
                <div class="col-md-6 feed">
                    <div class="list-font">
                        <div class="word-block">Lists </div>
                        <span class="uppernav"><Link to="/create"><a> <FontAwesomeIcon icon={ faList } /> </a></Link></span>
                    </div>
                        
                        <div class="topnav" id="myTopnav">
                            <a href="/lists"  class="col-md-4">Owned</a>
                            <a class="col-md-4">Subscribed</a>
                            <a href="/members" class="col-md-4">Members</a>
                        </div>
                    <div>
                        {listsubscriber}
                    </div>
                </div>
                <div class="col-md-3 feed">
                    <div>
                    <div>
                    <input type="text" class="searchbar" placeholder="Search Twitter" name="search" id="search"></input>
                    </div>
                    </div>
                </div>
                
            </div>



        )
    }


}


export default Subscriptions;