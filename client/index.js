import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import RequireAuth from './src/components/requireAuth';
import App from './src/components/App';
import Header from './src/components/Header';
import Dashboard from "./src/components/Dashboard";
import LoginForm from "./src/components/LoginForm";
import SignupForm from './src/components/SignupForm';
import ResetForm from './src/components/ResetForm';
import Profile from './src/components/Profile';
import NewPasswordForm from './src/components/NewPasswordForm';
import Settings from './src/components/Settings';
import './style/style.css';


const client = new ApolloClient({
    link: new HttpLink({
        uri: '/graphql',
        credentials: 'same-origin'
    }),
    cache: new InMemoryCache({
        dataIdFromObject: o => o.id
    })
});

ReactDOM.render(
    <ApolloProvider client={client}>
        <BrowserRouter>
            <div>
                <Header />
                <div className='container'>
                    <Switch>
                        <Route exact path='/' component={App} />
                        <Route path='/signup' component={SignupForm}/>
                        <Route path='/signin' component={LoginForm}/>
                        <Route path='/forgot' component={ResetForm}/>
                        <Route path='/reset/:token' component={NewPasswordForm}/>
                        <Route path='/dashboard' component={RequireAuth(Dashboard)}/>
                        <Route path='/profile' component={RequireAuth(Profile)}/>
                        <Route path='/settings' component={RequireAuth(Settings)}/>
                    </Switch>
                </div>
            </div>
        </BrowserRouter>
    </ApolloProvider>,
    document.getElementById('root'));