import React from 'react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

class NewScenarioDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = { name: '', description: '', 'validName': undefined };
    }
    createNewScenario() {
        if (this.state.name === '') {
            this.setState({ validName: false });
        }
        else {
            this.props.createNewScenario({ name: this.state.name, description: this.state.description });
            this.props.closeNewScenarioDialog();
        }
    }
    changeName(event, newValue) {
        this.setState({ name: newValue });
    }
    changeDescription(event, newValue) {
        this.setState({ description: newValue });
    }
    closeNewScenarioDialog() {
        this.setState({ validName: undefined });
        this.props.closeNewScenarioDialog();
    }

    render() {
        const actions = [
            <RaisedButton label="Close" primary={true} onClick={this.closeNewScenarioDialog.bind(this)}  className="scenariosBtn"/>,
            <RaisedButton label="OK" primary={true} onClick={this.createNewScenario.bind(this)} className="scenariosBtn"/>,
        ];
        let c = <div>
                    <TextField hintText="Enter a name" errorText={this.state.validName === false ? 'Required field' : ''} value={this.state.name} onChange={this.changeName.bind(this)} style={{'display':'block'}}/>
                    <TextField hintText="Enter a description" value={this.state.description} onChange={this.changeDescription.bind(this)} style={{'display':'block'}}/>
                </div>;
        return (
            <Dialog title="New Scenario" children={c} actions={actions} open={this.props.newScenarioDialogOpen} onRequestClose={this.props.closeNewScenarioDialog} contentStyle={{width:'566px'}}/>
        );
    }
}

export default NewScenarioDialog;
