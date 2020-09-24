import React, { Component } from 'react';
import cookie from 'react-cookies';
import { Link } from "react-router-dom";


class followers extends Component {

    constructor(props) {
        super(props);
        this.state = {
           
        }
        this.handleLogout = this.handleLogout.bind(this)
    }

    handleLogout = () => {
        console.log("in handlelogout")
        localStorage.clear();
        sessionStorage.clear();
        cookie.remove('authCookie', { path: '/' });
        this.setState({ isLoggedin: false });
        
     }
    


    render() {

        return (
                           
                <div class="col-md-3 feed1" style={{borderRight:"1px solid black"}}>
                    <span class="home-buttons"><img src="https://www.alc.edu/wp-content/uploads/2016/10/13-twitter-logo-vector-png-free-cliparts-that-you-can-download-to-you-Km878c-clipart.png" class="logo"></img><span style={{marginLeft:"15px",fontSize:"15px"}}>Hello, {sessionStorage.getItem("name")}</span></span><br /><br />
                    <a href="/home" class="a"><span class="home-buttons"><img src="https://cdn4.iconfinder.com/data/icons/roundies-2/32/birdhouse-512.png" class="logo4"></img>Home</span><br /><br /></a>
                    <a href="/explore" class="a"><span class="home-buttons"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAe1BMVEX///8DAQQAAABhYWHCwsK7u7sDAATr6+vY2Nj8/PyBgYHS0tLV1dXp6enx8fGlpaWenp5aWlp6enqampp2dXZlZWUyMTIiISIsKyxRUFFWVVaFhYVNTE0hICHExMRcXFwUExWysbIbGhxHRkc6OjqTk5M/P0AYFhkPDRBEv2DjAAAE+ElEQVR4nO2d6VIbQQyE8QLmNlcAQ8AcOeD9nzCVyo/82ma2mZbbsr4HkEdVW5J6Znq8s9OFh2E2xrBPxnwFMS/7LHsCM7CaQzLmLxDze9fVtzCA1SzImN9AzPOuq2/gDCxmOCKD/gBB97ouv4FTsJhbNujdaNA5/eXToKLwQMZcKL58mgtBUTgY5qMxh66rbwEVhQsy5gmIedd19S3cC4rCPoh503X1LSyD2+Fx19U3cJS+HR6gdsgGfXRqh6goLNmg6LsIb4eoKOyyQcebxRraISoKV2RMNAjO2EGQ5kpQFNCX/7Pr6ltARSGHOnwRFIVrJ3UI2+EBGdSqHUrUoVU7ROqQboeKQZBGoQ4lgyCNRh2OxpzlV4f0l0+DNktzqMPxLaPZcErGtFKHks1SxSBII1GHVpulqCjQm6Ubow6fyZhe7VBRFNAg+JFeHdJfPk20OmS/fJ6nLVaHg0QdsoMgjaQdomOCVc/Vt4CKwhMbFA2CVu2Q3TLyaofB6nALzg7j2+FlenX4nl8dji5mnkMdhl+lYQdBGrRZSp+gfGxxOxzi2yGakRXqcN519S1Eq8P4zdL86nD8BIW/X7cp6lBzdphDHaJjAit1+MYGfduUdkgXBXSylr4dxqtDRTtEg+Dvry54dyI36Lj98WZquH8xUYu9a4gJMxwmM7qYv58UyRdjfpIhiL4ZVIaVoT+VYWXoT2VYGfpTGVaG/lSGlaE/lWFl6E9lWBn6UxlWhv58mmHg3rQqKMxwbwIrdO60XE0J9Z8TdKZ83hYUZjiJvWgbfrgNoWz4DGXDj6Vs+Axlww+lbPgM22C0AA2/6+pbyP9IW9nwGcyMFmXDJ1AMgjQS95XitV4azc1Sp3aIZuQc6vA4+GZpfhs+OwjyKMzIikGQpowWFIrXemlQUaBt+FbqELXD/OqQnZG324Yf7zuMtuHTxwQ06FWaEzKm4piAJ70NHxYFxWaplQ2fnpEVxwQ04e2QHQRpotVh/OkoUodsO5QcE9CgGTmHOlTMyKUOQ1lE2/Ct3ix9Z4OiL589JqBRvErjtVmaXx2iGTn/I21sO5QcE9Cgp6pYdagYBHkU6lBxTEAjUYeKQZDmUFEUNubN0nsyppc6rHbIgNQh/R4TjaIoKPZFeG6D1aHX/x2yRQF9+dddl9/AQnG/7hlk2PGRtjajxTm6MkEaLVbomOBiUlCYYZivRRn0kwzB72wGlWFl6E9lWBn6UxlWhv5UhpWhP5VhZehPZVgZ+lMZVob+VIaVoT8d3omC0Um6xoQZNvz7BDpfYP/RAv2T3HJyTJhhA4qzQ3TUs4arNME2/Pw3S61s+PR1c2S0qJul3SmjBQO6RJbDaKG4RMYTbcP3ukpzRga1ukoT/n+HVr5D+n4dGgSt2mEO36GiKIBBcA2PtCmKgtcjbeh+XQ6jBWqH2Y0W/IysGARp8hstJDZ89Pe/1Q67U+qQAX358e0wvzqMtuHnUIfIhr8Go8X4YugZWeG4pUFF4YUNir58dhCkkbivrDZLUVFg22F+3+HmPNKmaIfx/2hRNnyG/OrQ6pG2suEzSAZBmvw2fEVRQO0whw3f65G2suEzmKlDgQ3fSh2iovDBBkWbpVbqkL9KMxoziTr02iyNfpUm/pE2xYUCr1dpFPfrzNRh9pul4f93aKUOc/zfYalDBi91GH2V5qXn4puIboedNkv/AM+6hfVApDumAAAAAElFTkSuQmCC" class="logo4"></img>Explore</span></a><br /><br />
                    <a href="/messages" class="a"><span class="home-buttons"><img src="https://img1.gratispng.com/20180910/cuf/kisspng-computer-icons-clip-art-email-font-awesome-symbol-message-svg-png-icon-free-download-371225-onl-5b96caeaac3f68.8944099415366090027055.jpg" class="logo4"></img>Messages</span><br /><br /></a>
                    <a href="/bookmarks" class="a"><span class="home-buttons"><img src="http://cdn.onlinewebfonts.com/svg/img_198285.png" class="logo4"></img>Bookmarks</span><br /><br /></a>
                    <a href="/lists" class="a"><span class="home-buttons"><img src="https://cdn4.iconfinder.com/data/icons/ad-network-icon-set-2/100/listing_1-512.png" class="logo4"></img>Lists</span><br /><br /></a>
                    <a href="/profile" class="a"><span class="home-buttons"><img src="https://library.kissclipart.com/20180904/ese/kissclipart-user-icon-png-clipart-computer-icons-user-66fe7db07b02eb73.jpg" class="logo4"></img>Profile</span><br/><br/></a>
                    <a href="/analytics" class="a"><span class="home-buttons"><img src="https://cdn1.vectorstock.com/i/1000x1000/76/15/analytics-icon-on-transparent-analytics-sign-vector-20707615.jpg" class="logo4"></img>Analytics</span><br /><br /></a>
                    <a href="/settings" class="a"><span class="home-buttons"><img src="https://upload.wikimedia.org/wikipedia/commons/6/6d/Windows_Settings_app_icon.png" class="logo4"></img>Settings</span><br /><br /></a>
                    <span class="home-buttons"><button class="buttons22" onClick = {this.handleLogout}>
                        <Link to="/login">Logout</Link>
                </button></span>
                    <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
                </div>

        )
    }

}


export default followers;





