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
        return (
            <Dialog 
                style={{display: this.props.open ? 'block' : 'none', marginLeft: '300px', left:'0px', width:'270px !important'}}
                overlayStyle={{display:'none'}} 
                className={'dialogGeneric'} 
                title="Options" 
                children={
                    <div>
                        <Checkbox label="Show planning unit popup" defaultChecked={this.props.userData.SHOWPOPUP} onCheck={(e, isInputChecked)=>this.setOption("SHOWPOPUP",isInputChecked)} style={{fontSize:'13px'}}/>
                        <div id="spinner"><FontAwesome spin name='sync' style={{'display': (this.props.savingOptions ? 'inline-block' : 'none')}} className={'optionsSpinner'}/></div>
                    </div>
                } 
                actions={[
                    <RaisedButton label="Save" primary={true} onClick={this.updateOptions.bind(this)} className="scenariosBtn" disabled={!this.state.saveEnabled} style={{minWidth:'15px', minHeight:'15px', height:'22px', fontSize:'10px', verticalAlign:'middle'}}/>,
                    <RaisedButton label="OK" primary={true} onClick={this.props.closeOptionsDialog} className="scenariosBtn" style={{minWidth:'15px', minHeight:'15px', height:'22px', fontSize:'10px', verticalAlign:'middle'}}/>,
                ]} 
                open={this.props.open} 
                onRequestClose={this.props.closeOptionsDialog} 
                contentStyle={{width:'270px'}} 
                titleClassName={'dialogTitleStyle'}
            />
        );
    }
}

export default OptionsDialog;
