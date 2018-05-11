import React from 'react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';
import FontAwesome from 'react-fontawesome';

class OptionsDialog extends React.Component {
    constructor(props){
        super(props);
        this.state = {saveEnabled: false};
        this.options = {};
    }
    setOption(key, value){
        this.setState({saveEnabled: true});
        this.options[key] = value;
    }
    updateOptions(){
        this.props.saveOptions(this.options);
    }
    render() {
        const actions = [
            <RaisedButton label="Close" primary={true} onClick={this.props.closeOptionsDialog} className="scenariosBtn"/>,
            <RaisedButton label="Save" primary={true} onClick={this.updateOptions.bind(this)} className="scenariosBtn" disabled={!this.state.saveEnabled}/>
        ];
        let c = <div>
                    <Checkbox label="Show planning unit popup" defaultChecked={this.props.userData.SHOWPOPUP} onCheck={(e, isInputChecked)=>this.setOption("SHOWPOPUP",isInputChecked)} />
                    <div id="spinner"><FontAwesome spin name='sync' style={{'display': (this.props.savingOptions ? 'inline-block' : 'none')}} className={'optionsSpinner'}/></div>
                </div>;
        return (
            <Dialog title="Options" children={c} actions={actions} open={this.props.open} onRequestClose={this.props.closeOptionsDialog} contentStyle={{width:'308px'}}/>
        );
    }
}

export default OptionsDialog;
