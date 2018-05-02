import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import FontAwesome from 'react-fontawesome';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = { visible: true, user: '', validatingUser: false, createUserVisible: false };
    }

    validateUser(e) {
        this.setState({ validatingUser: true });
        this.props.validateUser(this.state.user);
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        //see if the user has logged out
        if (this.props.userValidated === undefined && prevProps.userValidated === true) {
            this.logout()
        }
        //see if the user has been validated after pressing submit
        if (this.props.userValidated !== undefined && prevProps.userValidated === undefined) {
            this.setState({ validatingUser: false });
            if (this.props.userValidated) {
                this.login();
            }
            else {
                this.invalidUser();
            }
        }
        //see if the user has been created
        if (this.props.userCreated !== undefined && prevProps.userCreated === undefined) {
            if (this.props.userCreated) {
                this.closeDialog();
                this.login();
            }
            else {
                this.failedToCreateUser();
            }
        }
    }

    login() {
        this.setState({ visible: false });
        this.props.login(this.state.user);
    }
    logout() {
        this.setState({ visible: true });
    }
    invalidUser() {
        this.setState({ createUserVisible: true });
    }

    createNewUser(e) {
        this.props.createNewUser(this.state.user);
    }

    closeDialog() {
        this.setState({ createUserVisible: false });
    }

    failedToCreateUser() {

    }
    handleKeyPress(e) {
        if (e.nativeEvent.key === "Enter") this.validateUser();
    }
    render() {
        const actions = [
            <FlatButton label="No" primary={true} onClick={this.closeDialog.bind(this)} />,
            <FlatButton label="Yes" primary={true} keyboardFocused={true} onClick={this.createNewUser.bind(this)} />,
        ];
        let c = <div>
                    <div>
                        <TextField hintText="Enter your Username" floatingLabelText="Username" onChange = {(event,newValue) => this.setState({user:newValue})} className='loginUserField' disabled = {this.state.validatingUser ? true : false} onKeyPress={this.handleKeyPress.bind(this)}/>
                        <FontAwesome spin name='sync' style={{'display': (this.state.validatingUser ? 'inline-block' : 'none')}} className='spinner'/>
                    </div>
                    <RaisedButton onClick={(event) => this.validateUser(event)} label= {this.state.validatingUser ? "Logging in" : "Submit"} disabled = {this.state.validatingUser ? true : false} primary={true} className='submitButton' type="submit"/>
                </div>;
        return (
            <React.Fragment>
                <Dialog title="Login" modal={true} children={c} open={this.state.visible}/>
                <Dialog title="Invalid user" actions={actions} modal={true} open={this.state.createUserVisible} onRequestClose={this.handleClose} className='createNewUserDialog' contentStyle={{width:'350px'}}>
                 Create user {this.state.user} and login?
                </Dialog>
            </React.Fragment>
        );
    }
}

export default Login;
