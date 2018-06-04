import React, { Component } from 'react';

class Dashboard extends Component{


    render(){
        // console.log('test ', this.props);
        const { user } = this.props.data;
        return (
            <div>
                <h3>Welcome Back {user.email}</h3>
            </div>
        )
    }
}

// export default compose(
//     graphql(currentUser, {
//         name: 'data'
//     })
// )(Dashboard);

export default Dashboard;