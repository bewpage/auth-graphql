import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { graphql, compose } from 'react-apollo';
import currentUser from '../../queries/CurrentUser';
import logoutUser from '../../mutations/logoutUser';


class Header extends Component {
    constructor(props){
        super(props);
        // this.menuMobile = React.createRef();
        // this.menuMobileNav = React.createRef();
        // this.menuMobileOverlay = React.createRef();
        this.state = {
            toggle: false
        }
    }

    handleClick = (event) => {
        this.setState({
            toggle: !this.state.toggle
        })
    };

    closeSideMenuNav = (event) => {
        this.setState({
            toggle: !this.state.toggle
        })
    };

    logoutButton = (user) => {
        console.log('logout user', user);
        this.props.logoutUser({
            variables: {
                email: user
            },
            refetchQueries: [{
                query: currentUser
            }]
        })
            .then(() => {
               this.props.history.push('/')
            });
    };

    renderButtons(){
        const { loading, user } = this.props.data;
        const { toggle } = this.state;
        const toggleHandler = () => {
            return this.setState({
                toggle: !this.state.toggle
            })
        };
        // test for adding class name
        const classList = [
            'sidenav'
        ];

        const sideNavOpen = {
            transform: 'translateX(0%)'
        };
        if(loading){ <div> </div> }
        // here must be done some work to DRY code
        if(user){
            //menu when user is login
            return(
                <div>
                    <ul id='nav-mobile' className='right hide-on-med-and-down'>
                        <li><a>Profile</a></li>
                        <li><a>Dashboard</a></li>
                        <li><a>Settings</a></li>
                        <li><a onClick={() => this.logoutButton(user.email)}>Signout</a></li>
                    </ul>
                    <ul
                        className='sidenav'
                        id='mobile-demo'
                        // ref={this.menuMobileNav}
                        style={(toggle ? sideNavOpen : {})}
                    >
                        <li><a>Profile</a></li>
                        <li><a>Dashboard</a></li>
                        <li><a>Settings</a></li>
                        <li><a onClick={() => {this.logoutButton(user.email); toggleHandler()}}>Signout</a></li>
                    </ul>
                </div>
            )
        }else{
            return(
                <div>
                    <ul id='nav-mobile' className='right hide-on-med-and-down'>
                        <li><Link to='/signin'>Signin</Link></li>
                        <li><Link to='/signup'>Signup</Link></li>
                    </ul>
                    <ul
                        className={classList.join(' ')}
                        id='mobile-demo'
                        // ref={this.menuMobileNav}
                        style={(toggle ? sideNavOpen : {})}
                    >
                        <li><Link
                            to='/signin'
                            onClick={() => toggleHandler()}
                        >Signin</Link></li>
                        <li><Link
                            to='/signup'
                            onClick={() => toggleHandler()}
                        >Signup</Link></li>
                    </ul>
                </div>
            )
        }
    }


    render() {
        console.log('this.props header', this.props.location.pathname);
        // console.log('this.state header', this.state.toggle);
        // console.log('test', this.props.hasOwnProperty('data'));
        const { toggle } = this.state;
        const windowMenuOverlay = {
            opacity: 1,
            display: 'block'
        };
        return (
            <nav className=''>
                <div className='container'>
                    <div className='nav-wrapper'>
                        <Link className='brand-logo' to='/'>Home</Link>
                        <Link to='#'
                              data-target="mobile-demo"
                              className="sidenav-trigger"
                        ><i
                            className="material-icons"
                            // ref={this.menuMobile}
                            onClick={(event) => this.handleClick(event)}
                        >menu</i></Link>
                        {this.renderButtons()}
                    </div>
                </div>
                <div
                    className='sidenav-overlay'
                    // ref={this.menuMobileOverlay}
                    style={(toggle ? Object.assign({}, windowMenuOverlay) : {})}
                    onClick={(event) => this.closeSideMenuNav(event)}
                ></div>
            </nav>
        );
    }
}


export default compose(
    graphql(currentUser, {
        name: 'data'
    }),
    graphql(logoutUser,{
        name: 'logoutUser'
    })
)(withRouter(Header));
