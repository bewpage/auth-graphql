import gql from 'graphql-tag';

const logoutUser = gql`
    mutation logout($email: String){
        logout(email: $email){
            email
        }
    }
`;

export default logoutUser;