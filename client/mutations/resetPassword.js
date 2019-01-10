import gql from 'graphql-tag';

const resetPassword = gql`
    mutation reset($resetPasswordToken: String){
        reset($resetPasswordToken: $resetPasswordToken){
            resetPasswordToken
            resetPasswordExpires
        }
    }
`;

export default resetPassword;