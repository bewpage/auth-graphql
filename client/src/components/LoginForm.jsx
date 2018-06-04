import React, { Component } from 'react';
import AuthForm from "./AuthForm";
import { graphql, compose } from 'react-apollo';
import loginUser from '../../mutations/loginUser';
import currentUser from '../../queries/CurrentUser';

class LoginForm extends Component{
    constructor(props){
        super(props);
        this.state = {
            errors: []
        }
    }

    componentWillUpdate(nextProps){
        if(!this.props.data.user && nextProps.data.user){
            this.props.history.push('/dashboard')
        }
    }

    onSubmit = (email, password) => {
        // console.log('email in callback', email);
        // console.log('password in callback', password);
        this.props.loginUser({
            variables: {
                email,
                password
            },
            refetchQueries: [{
                query: currentUser
            }]
        })
            .catch(res => {
                const errors = res.graphQLErrors.map(error => error.message);
                // console.log('error', errors);
                this.setState({
                    errors
                })

            })
    };

    render(){
        // console.log('login user props', this.props);
        // console.log('login user state', this.state);
        return(
            <div>
                <h5>Signin</h5>
                <span
                    className="helper-text"
                    >
                    {this.state.errors[0]}
                    </span>
                <AuthForm
                    errors={this.state.errors}
                    onSubmit={this.onSubmit}
                />
            </div>
        )
    }
}

export default compose(
    graphql(currentUser, {
        name: 'data'
    }),
    graphql(loginUser, {
        name: 'loginUser'
    })
)(LoginForm);