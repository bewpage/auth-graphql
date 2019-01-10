import React, { Component } from 'react';
import AuthForm from './AuthForm';
import { axios } from 'react-axios'
import {compose, graphql} from "react-apollo";
import currentUser from "../../queries/CurrentUser";
import forgotPassword from "../../mutations/forgotPassword";


class ResetForm extends Component{
    constructor(props){
        super(props);
        this.state = {
            errors: [],
        };
    }

    onSubmit = (email) => {
        // console.log('email in callback', email);
        this.props.forgotPassword({
            variables: {
                email
            }
        })
            .catch(res => {
                const errors = res.graphQLErrors.map(error => error.message);
                console.log('error', errors);
                this.setState({
                    errors
                })
            });
    };

    render(){
        const { pathname } = this.props.location;
        console.log('component props', this.props);
        console.log('component path', pathname);
        console.log('component errors', this.state.errors);
        return(
            <div>
                <h5>Forgot Password</h5>
                <span
                className='helper-text'
                >
                    {this.state.errors[0]}
                </span>
                <AuthForm
                    errors={this.state.errors}
                    onSubmit={this.onSubmit}
                    location={pathname}
                />
            </div>
        )
    }

}

export default compose(
    graphql(currentUser, {
        name: 'data'
    }),
    graphql(forgotPassword, {
        name: 'forgotPassword'
    })
)(ResetForm);