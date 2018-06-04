import gql from 'graphql-tag';

const signupUser = gql`
    mutation signup($email: String, $password: String){
        signup(email: $email, password: $password){
            email
            id
        }
}
`;

export default signupUser;