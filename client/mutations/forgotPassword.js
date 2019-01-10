import gql from 'graphql-tag';

const forgotPassword = gql`
    mutation forgot($email: String){
        forgot(email: $email){
            email
            id
            resetPasswordToken
            resetPasswordExpires
        }
    }
`;

export default forgotPassword;