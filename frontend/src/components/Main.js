import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Signup from './signup/userSignup'
import Login from './login/login';
import Launchpage from './users/launchpage'
import UserHome from './userFeed/userHome'
import Explore from './userFeed/explore'
import Explore1 from './userFeed/explore1'
import Messages from './userFeed/messages'
import Bookmarks from './userFeed/bookmarks'
import Lists from './userFeed/lists'
import Profile from './userFeed/profile'
import Analytics from './userFeed/analytics'
import Settings from './userFeed/settings'
import listsCreate from './userFeed/listsCreate';
import listsAdduser from './userFeed/listAddusers';
import Subscriptions from './userFeed/subscriptions';

import tweets from './userFeed/tweets';
import Inbox from './chat/inbox';
import Newmessages from './chat/newmessage';
import editProfile from './userFeed/editprofile';
import followers from './userFeed/followers';
import following from './userFeed/following';
import DescribeTweets from './userFeed/describeTweet';
import Members from './userFeed/members';
import IndividualList from './userFeed/individualList';
import SubscribedList from './userFeed/subscribedList';
import MemberList from './userFeed/memberList';
import ExploreList from './userFeed/exploreList'
import editlist from './userFeed/editlist';
import otherlist from './userFeed/otherlist';
import ownmembers from './userFeed/ownmembers';
import ownsubscribers from './userFeed/ownsubscribers';
import subscribers from './userFeed/subscribers';

import othermembers from './userFeed/othermembers';
import otherindlist from './userFeed/otherindlist';

class Main extends Component {
    render() {
        return ( 
            <div>
                <Route path="/signup" component={Signup} />
                <Route exact path="/" component={Launchpage} /> 
                <Route path="/login" component={Login} />
                <Route path="/launchpage" component={Launchpage} />
                <Route path="/home" component={UserHome} />
                <Route path="/explore" component={Explore} />
                <Route path="/explore1" component={Explore1} />
                <Route path="/messages" component={Messages} />
                <Route path="/bookmarks" component={Bookmarks} />
                <Route path="/lists" component={Lists} />
                <Route path="/indlist" component={IndividualList}/>
                <Route path="/otherindlist" component={otherindlist}/>
                <Route path="editlist" component={editlist}/>
                <Route path="/sublist" component={SubscribedList}/>
                <Route path="/memlist" component={MemberList}/>
                <Route path="/create" component = {listsCreate}/>
                <Route path="/subscriptions" component= {Subscriptions}/>
                <Route path="/members" component={Members}/>
                <Route path="/adduser" component = {listsAdduser}/>
                <Route path="/profile" component={Profile} />
                <Route path="/analytics" component={Analytics} />
                <Route path="/settings" component={Settings} />
                <Route path="/tweets" component={tweets} />
                <Route path="/descTweets" component={DescribeTweets} />
                <Route path="/inbox" component={Inbox} />
                <Route path="/newmessages" component={Newmessages} />
                <Route path="/editprofile" component={editProfile} />
                <Route path="/followers" component={followers} />
                <Route path="/following" component={following} />
                <Route path="/exploreList" component={ExploreList} />
                <Route path="/otherlist" component={otherlist} />
                <Route path="/subscribers" component={subscribers} />
                <Route path="/othermembers" component={othermembers} />
                <Route path="/ownmembers" component={ownmembers} />
                <Route path="/ownsubscribers" component={ownsubscribers} />
            </div>
        )
    }
}
//Export The Main Component
export default Main;
