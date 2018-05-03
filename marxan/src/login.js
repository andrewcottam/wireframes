import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import FontAwesome from 'react-fontawesome';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = { createUserOpen: false };
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        //if the user has been validated then login
        if (this.props.validUser && prevProps.validUser === undefined) {
            this.props.login(this.state.user);
        }
        //if the user has not been validated then show the create new user form
        if (this.props.validUser === false && prevProps.validUser === undefined) {
            this.setState({ createUserOpen: true });
        }
    }
    closeDialog() {
        this.setState({ createUserOpen: false });
        this.props.logout(); //reset validUser to undefined
    }

    handleKeyPress(e) {
        if (e.nativeEvent.key === "Enter") this.validateUser();
    }
    validateUser() {
        this.props.validateUser(this.state.user);
    }
    createNewUser() {
        this.closeDialog();
        this.props.createNewUser(this.state.user);
    }
    render() {
        let c = <div>
                    <div>
                        <FontAwesome spin name='sync' style={{'display': (this.props.validatingUser ? 'inline-block' : 'none')}} className='loginSpinner'/>
                        <TextField hintText="Enter your Username" floatingLabelText="Username" onChange = {(event,newValue) => this.setState({user:newValue})} className='loginUserField' disabled = {this.props.validatingUser ? true : false} onKeyPress={this.handleKeyPress.bind(this)}/>
                    </div>
                    <RaisedButton onClick={this.validateUser.bind(this)} label= {this.props.validatingUser ? "Logging in" : "Submit"} disabled = {this.props.validatingUser ? true : false} primary={true} className='submitButton' type="submit"/>
                </div>;
        return (
            <React.Fragment>
                <Dialog title="Login" modal={true} children={c} open={this.props.open} contentStyle={{width:'308px'}}/>
                <Dialog title="Invalid user" actions={
                    [
                        <FlatButton label="No" primary={true} onClick={this.closeDialog.bind(this)} />,
                        <FlatButton label="Yes" primary={true} keyboardFocused={true} onClick={this.createNewUser.bind(this)} />,
                    ]
                } modal={true} open={this.state.createUserOpen} onRequestClose={this.handleClose} className='createNewUserDialog' contentStyle={{width:'566px'}}>
                 Create user {this.state.user} and login?
                </Dialog>
            </React.Fragment>
        );
    }
}

export default Login;
