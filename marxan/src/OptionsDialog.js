import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';

class OptionsDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = { checked: true };
    }
    closeOptionsDialog() {
        this.props.closeOptionsDialog();
    }
    buttonClick() {

    }

    updateCheck() {
        this.setState((oldState) => {
            this.props.setShowPopupOption(!oldState.checked);
            return {
                checked: !oldState.checked,
            };
        });
    }

    render() {
        const actions = [
            <RaisedButton label="Close" primary={true} onClick={this.closeOptionsDialog.bind(this)} className="scenariosBtn"/>,
        ];
        let c = <div>
                <Checkbox
                  label="Show planning unit popup"
                  checked={this.state.checked}
                  onCheck={this.updateCheck.bind(this)}
                />
                </div>;
        return (
            <Dialog title="Options" children={c} actions={actions} open={this.props.open} onRequestClose={this.props.closeOptionsDialog} contentStyle={{width:'308px'}}/>
        );
    }
}

export default OptionsDialog;
