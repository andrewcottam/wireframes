import React from 'react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import FontAwesome from 'react-fontawesome';
import NewUserDialog from './NewUserDialog.js';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = { newUserDialogOpen: false };
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        //if the user has been validated then login
        if (this.props.validUser && prevProps.validUser === undefined) {
            this.props.login(this.state.user);
            this.closeNewUserDialog();
        }
        //if the user was validated and isnt any more, then they must have logged out
        if (this.props.validUser === undefined && prevProps.validUser === true) {
            this.setState({ user: '' });
        }
        //if the user was not validated then reset the form
        if (this.props.validUser === false && prevProps.validUser === undefined) {
            this.props.logout();
            this.closeNewUserDialog();
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
    createNewUser(user, password, name, email, mapboxpk) {
        this.setState({ user: user });
        this.props.createNewUser(user, password, name, email, mapboxpk);
    }
    registerNewUser() {
        this.setState({ newUserDialogOpen: true });
    }
    closeNewUserDialog() {
        this.setState({ newUserDialogOpen: false });
    }
    render() {
        const actions = [
            <RaisedButton onClick={this.registerNewUser.bind(this)} label= "Register" className="scenariosBtn" primary={true} disabled={this.props.validatingUser || this.props.loggingIn ? true : false}/>,
            <RaisedButton onClick={this.validateUser.bind(this)} label= {this.props.validatingUser || this.props.loggingIn ? "Logging in" : "Login"} disabled = {!this.state.user || this.props.validatingUser || this.props.loggingIn ? true : false} primary={true} className="scenariosBtn" type="submit"/>
        ];
        let c = <div>
                    <div>
                        <FontAwesome spin name='sync' style={{'display': (this.props.validatingUser || this.props.loggingIn ? 'inline-block' : 'none')}} className='loginSpinner'/>
                        <TextField errorText={(this.props.validUser === false) ? "Invalid user" : ''} floatingLabelText="Username" onChange = {(event,newValue) => this.setState({user:newValue})} className='loginUserField' disabled = {this.props.validatingUser || this.props.loggingIn ? true : false} onKeyPress={this.handleKeyPress.bind(this)} value={this.state.user}/>
                    </div>
                </div>;
        return (
            <React.Fragment>
                <Dialog actions={actions} title="Login" modal={true} children={c} open={this.props.open} contentStyle={{width:'308px'}}/>
                <NewUserDialog open={this.state.newUserDialogOpen} closeNewUserDialog={this.closeNewUserDialog.bind(this)} createNewUser={this.createNewUser.bind(this)} />
            </React.Fragment>
        );
    }
}

export default Login;
