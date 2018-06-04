import React, { Component } from 'react';
import AuthForm from './AuthForm';
import { graphql, compose } from 'react-apollo';
import currentUser from '../../queries/CurrentUser';
import signupUser from '../../mutations/signupUser';

class SignupForm extends Component{
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
        this.props.signupUser({
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
                console.log('error', errors);
                this.setState({
                    errors
                })
            })
    };

    render(){
        return(
            <div>
                <h5>Singup</h5>
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
    graphql(signupUser, {
        name: 'signupUser'
    })
)(SignupForm);