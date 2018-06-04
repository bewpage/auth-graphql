import gql from 'graphql-tag';

const currentUser = gql`
    query {
        user{
            id
            email
        }
    }
`;

export default currentUser;