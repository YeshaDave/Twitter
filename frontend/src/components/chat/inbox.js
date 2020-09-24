import React, { Component } from 'react';
import '../../App.css';
import './Chat.css';
import { Link } from "react-router-dom";
import axios from 'axios';
import { Redirect } from 'react-router';
import 'bootstrap/dist/css/bootstrap.min.css';


class Inbox extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userID: this.props.location.state.userID,
            chats: [],
        }

        this.sendChange = this.sendChange.bind(this)
        this.onSend = this.onSend.bind(this)
    }

    componentDidMount() {
        console.log("hey", this.state.userID)
        const data = {
            params: {
                receiverID: this.state.userID
            }
        }
        axios.defaults.withCredentials = true;
        axios.get('/messages/view', data)
            .then((response) => {
                this.setState({
                    chats: response.data
                });
                console.log(response.data)

            });
    }

    sendChange = (e) => {
        this.setState({
            chat: e.target.value
        })
        console.log("send chat", this.state.chat)
    }

    onSend = () => {
        const data = {
            chat: this.state.chat,
            receiverID: this.state.userID
        }
        console.log(this.state.userID)

        console.log(data.receiverID)
        axios.defaults.withCredentials = true;
        axios.post('/messages/send', data)
            .then((response) => {
                console.log(response)

            })
            .catch((error) => {
                console.log("Something went wrong")
            })
        this.componentDidMount()
    }

    render() {

        let redirectVar = null;
        if (localStorage.getItem('email') == null) {
            console.log("in cookie if")
            redirectVar = <Redirect to="/login" />
        }

        console.log("user id ", this.state.userID)
        let content = this.state.chats.map(chat => (
            <div class="mesgs">
                <div class="msg_history"  >
                    {chat.senderID == this.state.userID && <div class="incoming_msg" >
                        <div class="incoming_msg_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"></img> </div>
                        <div class="received_msg">
                            <div class="received_withd_msg">
                                <p>{chat.chat}</p>
                                <span class="time_date"> {chat.createdAt.split("T")[0]}  {chat.createdAt.split("T")[1].split(".")[0]}</span>
                            </div>
                        </div>
                    </div>}

                    {chat.receiverID == this.state.userID && <div class="outgoing_msg" >
                        <div class="sent_msg">
                            <p>{chat.chat}</p>
                            <span class="time_date">{chat.createdAt.split("T")[0]}  {chat.createdAt.split("T")[1].split(".")[0]} </span>
                        </div>
                    </div>}
                </div>
            </div>
        ))

        return (
            <div class="container-flex">
                {redirectVar}
                <div class="col-md-3 feed">
                    <span class="home-buttons"><img src="https://www.alc.edu/wp-content/uploads/2016/10/13-twitter-logo-vector-png-free-cliparts-that-you-can-download-to-you-Km878c-clipart.png" class="logo"></img></span><br /><br />
                    <a href="/home" class="a"><span class="home-buttons"><img src="https://cdn4.iconfinder.com/data/icons/roundies-2/32/birdhouse-512.png" class="logo4"></img>Home</span><br /><br /></a>
                    <a href="/explore" class="a"><span class="home-buttons"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAe1BMVEX///8DAQQAAABhYWHCwsK7u7sDAATr6+vY2Nj8/PyBgYHS0tLV1dXp6enx8fGlpaWenp5aWlp6enqampp2dXZlZWUyMTIiISIsKyxRUFFWVVaFhYVNTE0hICHExMRcXFwUExWysbIbGhxHRkc6OjqTk5M/P0AYFhkPDRBEv2DjAAAE+ElEQVR4nO2d6VIbQQyE8QLmNlcAQ8AcOeD9nzCVyo/82ma2mZbbsr4HkEdVW5J6Znq8s9OFh2E2xrBPxnwFMS/7LHsCM7CaQzLmLxDze9fVtzCA1SzImN9AzPOuq2/gDCxmOCKD/gBB97ouv4FTsJhbNujdaNA5/eXToKLwQMZcKL58mgtBUTgY5qMxh66rbwEVhQsy5gmIedd19S3cC4rCPoh503X1LSyD2+Fx19U3cJS+HR6gdsgGfXRqh6goLNmg6LsIb4eoKOyyQcebxRraISoKV2RMNAjO2EGQ5kpQFNCX/7Pr6ltARSGHOnwRFIVrJ3UI2+EBGdSqHUrUoVU7ROqQboeKQZBGoQ4lgyCNRh2OxpzlV4f0l0+DNktzqMPxLaPZcErGtFKHks1SxSBII1GHVpulqCjQm6Ubow6fyZhe7VBRFNAg+JFeHdJfPk20OmS/fJ6nLVaHg0QdsoMgjaQdomOCVc/Vt4CKwhMbFA2CVu2Q3TLyaofB6nALzg7j2+FlenX4nl8dji5mnkMdhl+lYQdBGrRZSp+gfGxxOxzi2yGakRXqcN519S1Eq8P4zdL86nD8BIW/X7cp6lBzdphDHaJjAit1+MYGfduUdkgXBXSylr4dxqtDRTtEg+Dvry54dyI36Lj98WZquH8xUYu9a4gJMxwmM7qYv58UyRdjfpIhiL4ZVIaVoT+VYWXoT2VYGfpTGVaG/lSGlaE/lWFl6E9lWBn6UxlWhv58mmHg3rQqKMxwbwIrdO60XE0J9Z8TdKZ83hYUZjiJvWgbfrgNoWz4DGXDj6Vs+Axlww+lbPgM22C0AA2/6+pbyP9IW9nwGcyMFmXDJ1AMgjQS95XitV4azc1Sp3aIZuQc6vA4+GZpfhs+OwjyKMzIikGQpowWFIrXemlQUaBt+FbqELXD/OqQnZG324Yf7zuMtuHTxwQ06FWaEzKm4piAJ70NHxYFxWaplQ2fnpEVxwQ04e2QHQRpotVh/OkoUodsO5QcE9CgGTmHOlTMyKUOQ1lE2/Ct3ix9Z4OiL589JqBRvErjtVmaXx2iGTn/I21sO5QcE9Cgp6pYdagYBHkU6lBxTEAjUYeKQZDmUFEUNubN0nsyppc6rHbIgNQh/R4TjaIoKPZFeG6D1aHX/x2yRQF9+dddl9/AQnG/7hlk2PGRtjajxTm6MkEaLVbomOBiUlCYYZivRRn0kwzB72wGlWFl6E9lWBn6UxlWhv5UhpWhP5VhZehPZVgZ+lMZVob+VIaVoT8d3omC0Um6xoQZNvz7BDpfYP/RAv2T3HJyTJhhA4qzQ3TUs4arNME2/Pw3S61s+PR1c2S0qJul3SmjBQO6RJbDaKG4RMYTbcP3ukpzRga1ukoT/n+HVr5D+n4dGgSt2mEO36GiKIBBcA2PtCmKgtcjbeh+XQ6jBWqH2Y0W/IysGARp8hstJDZ89Pe/1Q67U+qQAX358e0wvzqMtuHnUIfIhr8Go8X4YugZWeG4pUFF4YUNir58dhCkkbivrDZLUVFg22F+3+HmPNKmaIfx/2hRNnyG/OrQ6pG2suEzSAZBmvw2fEVRQO0whw3f65G2suEzmKlDgQ3fSh2iovDBBkWbpVbqkL9KMxoziTr02iyNfpUm/pE2xYUCr1dpFPfrzNRh9pul4f93aKUOc/zfYalDBi91GH2V5qXn4puIboedNkv/AM+6hfVApDumAAAAAElFTkSuQmCC" class="logo4"></img>Explore</span></a><br /><br />
                    <a href="/messages" class="a"><span class="home-buttons1"><img src="https://img1.gratispng.com/20180910/cuf/kisspng-computer-icons-clip-art-email-font-awesome-symbol-message-svg-png-icon-free-download-371225-onl-5b96caeaac3f68.8944099415366090027055.jpg" class="logo4"></img>Messages</span><br /><br /></a>
                    <a href="/bookmarks" class="a"><span class="home-buttons"><img src="http://cdn.onlinewebfonts.com/svg/img_198285.png" class="logo4"></img>Bookmarks</span><br /><br /></a>
                    <a href="/lists" class="a"><span class="home-buttons"><img src="https://cdn4.iconfinder.com/data/icons/ad-network-icon-set-2/100/listing_1-512.png" class="logo4"></img>Lists</span><br /><br /></a>
                    <a href="/profile" class="a"><span class="home-buttons"><img src="https://library.kissclipart.com/20180904/ese/kissclipart-user-icon-png-clipart-computer-icons-user-66fe7db07b02eb73.jpg" class="logo4"></img>Profile</span><br /><br /></a>
                    <a href="/analytics" class="a"><span class="home-buttons"><img src="https://cdn1.vectorstock.com/i/1000x1000/76/15/analytics-icon-on-transparent-analytics-sign-vector-20707615.jpg" class="logo4"></img>Analytics</span><br /><br /></a>
                    <a href="/settings" class="a"><span class="home-buttons"><img src="https://upload.wikimedia.org/wikipedia/commons/6/6d/Windows_Settings_app_icon.png" class="logo4"></img>Settings</span><br /><br /></a>
                    <span class="home-buttons"><button class="buttons3">
                        Tweet
                </button></span>
                    <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
                </div>

                <div class="col-md-6 feed">

                    <div class="messaging" >
                        <div class="inbox_msg">
                            <h2>
                                <div class="inbox-header">
                                    <div class="inbox-title" style={{ display: "flex" }} >
                                        <div><Link to="/messages"><button class="buttons3" name="back" style={{ marginTop: "30px", marginLeft: "5px", width: "70px", height: "35px" }} >Back</button></Link></div>
                                        <div style={{ width: "150px", marginLeft: "25%", marginTop: "3%" }}>
                                            <img src="https://ptetutorials.com/images/user-profile.png" class="logo1" style={{ marginLeft: "45%" }}></img>
                                            <div class="fullname" style={{ marginTop: "2%", marginLeft: "50%" }}> {sessionStorage.getItem('msg_user')}</div>
                                        </div>
                                    </div>
                                </div>
                            </h2>
                            {content}
                        </div>
                    </div>
                    <div class="contact-form" style={{ width: "80%", margin: "0 auto" }}>
                        <div style={{ width: "100%" }} >
                            <input type="text" name="textmsg" class="sendmsg" placeholder="  Start a new message" onChange={this.sendChange} required />
                            <button class="buttons3" onClick={this.onSend} style={{ width: "70px", height: "35px" }}>Send</button>
                        </div></div>
                </div>

            </div>



        )
    }

}


export default Inbox;





