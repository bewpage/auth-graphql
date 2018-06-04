import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { graphql, compose } from 'react-apollo';
import currentUser from '../../queries/CurrentUser';

export default (WrappedComponent) => {
    class RequireAuth extends Component {

        componentWillUpdate(nextProps){
            if(!nextProps.data.loading && !nextProps.data.user){
                this.props.history.push('/signin')
            }
        }

        render(){
            // console.log('HOC');
            if(this.props.data.user){
                return (
                    <WrappedComponent {...this.props} />
                )
            }else{
                return (
                    <Redirect to='/' push={true} />
                )
            }

        }
    }

    return compose(
        graphql(currentUser, {
            name: 'data'
        }))(RequireAuth)
};
