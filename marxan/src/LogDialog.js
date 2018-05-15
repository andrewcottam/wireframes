import React from 'react';
import 'react-table/react-table.css';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';

class LogDialog extends React.Component {
    render() {
        const actions = [
            <RaisedButton label="Close" primary={true} onClick={this.props.closeLogDialog} className="scenariosBtn"/>,
        ];
        let c = <div id="log" dangerouslySetInnerHTML={{__html:this.props.log}}></div>;
        return (
            <Dialog title="Log" children={c} actions={actions} open={this.props.open} onRequestClose={this.props.closeLogDialog} contentStyle={{width:'500px'}}/>
        );
    }
}

export default LogDialog;
