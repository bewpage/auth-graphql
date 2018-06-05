import React, { Component } from 'react';

class Profile extends Component{


    render(){
        // console.log('test ', this.props);
        const { user } = this.props.data;
        return (
            <div className='center-align'>
                <h3>Profile</h3>
                <h5>user: {user.email}</h5>
            </div>
        )
    }
}

// export default compose(
//     graphql(currentUser, {
//         name: 'data'
//     })
// )(Dashboard);

export default Profile;