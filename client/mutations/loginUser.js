import gql from 'graphql-tag';

const loginUser = gql`
    mutation login($email: String, $password: String){
        login(email: $email, password: $password){
            email
            id
        }
    }
`;

export default loginUser;