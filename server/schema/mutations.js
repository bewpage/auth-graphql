const graphql = require('graphql');
const {
    GraphQLObjectType,
    GraphQLString
} = graphql;
const UserType = require('./types/user_type');
const AuthService = require('../services/auth');

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
       signup: {
           type: UserType,
           args: {
               email: { type: GraphQLString },
               password: { type: GraphQLString },
           },
           resolve(parentValue, { email, password }, req){
               return AuthService.signup({ email, password, req })

           }
       },
        logout: {
           type: UserType,
            args: {
               email: { type: GraphQLString }
            },
            resolve(parentValue, args, req){
               const { user } = req;
               req.logout();
               return user;
            }
        },
        login: {
           type: UserType,
            args: {
               email: { type: GraphQLString },
                password: { type: GraphQLString }
            },
            resolve(parentValue, { email, password }, req ){
               return AuthService.login({ email, password, req })
            }
        },
        forgot: {
           type: UserType,
            args: {
               email: { type: GraphQLString },
            },
            resolve(parentValue, { email }, req){
               return AuthService.forgot({ email, req })
            }
        },
        reset: {
           type: UserType,
            args: {
                resetPasswordToken: { type: GraphQLString}
            },
            resolve(parentValue, { token }, req){
               return AuthService.reset({ token , req })
            }
        }
    }
});

module.exports = mutation;