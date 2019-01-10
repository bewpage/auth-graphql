import React, { Component } from 'react';

class AuthForm extends Component{
    constructor(props){
        super(props);
        this.emailLabel = React.createRef();
        this.passwordLabel = React.createRef();
        this.emailRef = React.createRef();
        this.passwordRef = React.createRef();
        this.helperEmailText = React.createRef();
        this.state = {
            email: '',
            password: '',
            isEmailFocus: false,
            isPasswordFocus: false,
            formErrors: {email: '', password: ''},
            formValid: false,
            emailValid: false,
            passwordValid: false
        };
    }


    _onBlur = (event) => {
        const { email, password } = this.state;
        const { target } = event;

        switch(target.type){
            case 'email':
                if(email.length <= 0) {
                    if (this.state.isEmailFocus) {
                        this.emailLabel.current.classList.remove('active');
                        this.setState({
                            isEmailFocus: false
                        });
                    }
                }
                break;
            case 'password':
                if(password.length <= 0) {
                    if (this.state.isPasswordFocus) {
                        this.passwordLabel.current.classList.remove('active');
                        this.setState({
                            isPasswordFocus: false
                        });
                    }
                }
                break;
            default:
                break;
        }

    };


    _onFocus = (event) => {
        const { target } = event;
        // console.log('ref type info', target.type);

        switch(target.type){
            case 'email':
                // console.log('label selected', this.emailLabel.current);
                if(!this.state.isEmailFocus){
                    this.setState({
                        isEmailFocus: true
                    });
                    this.emailLabel.current.classList.add('active');
                }
                break;
            case 'password':
                // console.log('label selected', this.passwordLabel.current);
                if(!this.state.isPasswordFocus){
                    this.setState({
                        isPasswordFocus: true
                    });
                    this.passwordLabel.current.classList.add('active');
                }
                break;
            default:
                break;
        }
    };

    handlerAnyInputChange = (event, nameInState) => {
        const value = event.target.value;
        this.setState({
                [nameInState]: value,
            },
            () => {this.validateField(nameInState, value)}
        )
    };

    validateField = (fieldName, value) => {
        let fieldValidationErrors = this.state.formErrors;
        let { emailValid, passwordValid } = this.state;
        switch(fieldName){
            case 'email':
                const emailRefValid = this.emailRef.current.validity.valid;
                const emailRef = this.emailRef.current;

                fieldValidationErrors.email = this.emailRef.current.validationMessage;
                if(!emailRefValid){
                    emailRef.classList.add('invalid');
                }else{
                    emailRef.classList.remove('invalid');
                    emailRef.classList.add('valid');
                    emailValid = emailRefValid;
                }

                break;
            case 'password':
                const passwordRef = this.passwordRef.current;
                const passwordRefValid = this.passwordRef.current.validity.tooShort;
                fieldValidationErrors.password = this.passwordRef.current.validationMessage;
                if(passwordRefValid){
                    passwordRef.classList.add('invalid')
                }else{
                    passwordRef.classList.remove('invalid');
                    passwordRef.classList.add('valid');
                    passwordValid = !passwordRefValid;
                }
                break;
            default:
                break;
        }

        this.setState({
            formErrors: fieldValidationErrors,
            emailValid,
            passwordValid
        }, this.validateForm);
    };

    validateForm(){
        if(this.props.location === '/forgot'){
            this.setState({
                formValid: this.state.emailValid
            })
        }else{
            this.setState({
                formValid: this.state.emailValid && this.state.passwordValid
            })
        }
    }

    submitUser=(event) => {
        // console.log('submitUser');
        event.preventDefault();
        const { email, password } = this.state;

        this.props.onSubmit(email, password);
        this.setState({
            email: '',
            password: '',
            isEmailFocus: false,
            isPasswordFocus: false,
            formValid: false
        });
        // console.log('reload to', this.props);

    };

    renderPasswordInput(){
        if(this.props.location === '/forgot'){
            return(
                <div> </div>
            )
        }else{
            return(
                <div className='row'>
                    <div className='input-field col s6'>
                        <label htmlFor="password"
                               ref={this.passwordLabel}
                        >Password
                        </label>
                        <input type="password"
                               id='password'
                               name='password'
                               ref={this.passwordRef}
                               className='validate'
                               minLength="4"
                               value={this.state.password}
                               onBlur={event => this._onBlur(event)}
                               onFocus={event => this._onFocus(event)}
                               onChange={event => this.handlerAnyInputChange(event, 'password')}
                        />
                        <span
                            className="helper-text"
                            data-error={this.state.formErrors.password}
                            data-success="right">
                                    Helper text
                                </span>
                    </div>
                </div>
            )
        }
    };

    render() {
        // console.log('authform props', this.props);
        return (
            <div className='row'>
                <form
                    className='col s12'
                    onSubmit={e => { e.preventDefault(); }}
                >
                    <div className='row'>
                        <div className='input-field col s6'>
                            <label htmlFor="email"
                                   ref={this.emailLabel}
                            >Email
                            </label>
                            <input type="email"
                                   id='email'
                                   name='email'
                                   ref={this.emailRef}
                                   value={this.state.email}
                                   className='validate'
                                   onBlur={event => this._onBlur(event)}
                                   onFocus={event => this._onFocus(event)}
                                   onChange={event => this.handlerAnyInputChange(event, 'email')}
                            />
                            <span
                                className="helper-text"
                                ref={this.helperEmailText}
                                data-error={this.state.formErrors.email}
                                data-success="right"
                            >
                                Helper text
                            </span>
                        </div>
                    </div>
                    {this.renderPasswordInput()}
                    <button
                        type='button'
                        className='btn waves-effect waves-light'
                        onClick={this.submitUser}
                        disabled={!this.state.formValid}
                    >Sign In</button>
                </form>
            </div>
        );
    }
}

export default AuthForm;