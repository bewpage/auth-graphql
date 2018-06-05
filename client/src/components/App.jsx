import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { graphql, compose } from 'react-apollo';
import currentUser from '../../queries/CurrentUser';


class App extends Component {

    render() {
        // console.log('this.props app', this.props);
        const { loading, user } = this.props.data;
        if(loading){
            return (<div> </div>)
        }
        if(user){
            return (
                <Redirect to='/dashboard' push={true}/>
            )
        }else{
            return (
                <div className='center-align'>
                    <h3>
                        App Home Page
                    </h3>
                </div>
            );
        }
    }
}

export default compose(
    graphql(currentUser, {
        name: 'data'
    })
)(App);
