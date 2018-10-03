import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import { List, ListItem, makeSelectable } from 'material-ui/List';
import FontAwesome from 'react-fontawesome';

let SelectableList = makeSelectable(List);

function wrapState(ComposedComponent) {
    return class SelectableList extends Component {
        static propTypes = {
            children: PropTypes.node.isRequired,
            defaultValue: PropTypes.string.isRequired,
        };

        componentWillMount() {
            this.setState({
                selectedIndex: this.props.defaultValue,
            });
        }

        handleRequestChange = (event, index) => { 
            this.setState({
                selectedIndex: index,
            });
            this.props.changeScenario(event, index);
        };

        render() {
            return (
                <ComposedComponent
                  value={this.state.selectedIndex}
                  onChange={this.handleRequestChange}
                  style={{'height':'235px','overflow':'auto'}}
                >
          {this.props.children}
        </ComposedComponent>
            );
        }
    };
}

SelectableList = wrapState(SelectableList);

class ScenariosDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = { selectedScenario: undefined };
    }
    _delete() {
        this.props.deleteScenario(this.state.selectedScenario);
        this.setState({ selectedScenario: false });
    }
    load() {
        this.props.loadScenario(this.state.selectedScenario);
    }
    _new() {
        this.props.openNewCaseStudyDialog();
    }
    cloneScenario(){
        this.props.cloneScenario(this.state.selectedScenario);
    }
    changeScenario(event, scenario) {
        this.setState({ selectedScenario: scenario });
    }
    render() {
        let listitems = this.props.scenarios && this.props.scenarios.map((scenario) => {
            let primary = <div style={{fontSize:'13px'}}>{scenario.name}</div>;
            var oldVersion = (scenario.oldVersion === 'True') ? 'OLD VERSION' : '';
            let secondary = <div style={{fontSize:'12px'}}>{scenario.description + " (created: " + scenario.createdate + ") " + oldVersion}</div>;
            return (<ListItem 
                key={scenario.name} 
                value={scenario.name} 
                primaryText={primary} 
                secondaryText={secondary} 
                innerDivStyle={{padding:'3px'}}
            />);
        });
        if (!listitems) listitems = <div></div>; //to stop console warnings
        return (
            <React.Fragment>
                <Dialog 
                    style={{display: this.props.open ? 'block' : 'none', marginLeft: '60px', left:'0px', width:'400px !important'}}
                    overlayStyle={{display:'none'}} 
                    className={'dialogGeneric'} 
                    children={
                        <React.Fragment>
                            <SelectableList defaultValue ={this.props.scenario} children={listitems} changeScenario={this.changeScenario.bind(this)} style={{'height':'600px'}}/>
                            <div id="spinner"><FontAwesome spin name='sync' style={{'display': (this.props.loadingScenarios || this.props.loadingScenario ? 'inline-block' : 'none')}} className={'scenarioSpinner'}/></div>
                        </React.Fragment>
                    } 
                    title="Scenarios" 
                    actions={[
                        <RaisedButton icon={<FontAwesome name='file-medical' title='New scenario'/>} keyboardFocused={true} onClick={this._new.bind(this)} disabled={this.props.loadingScenarios || this.props.loadingScenario} style={{minWidth:'15px', minHeight:'15px',height:'22px',width:'22px',fontSize:'10px', verticalAlign:'middle', margin:'5px'}}/>,
                        <RaisedButton icon={<FontAwesome name='cloud-upload-alt' title='Upload Marxan project from local machine'/>} onClick={this.props.openImportWizard} style={{minWidth:'15px', minHeight:'15px',height:'22px',width:'22px',fontSize:'10px', verticalAlign:'middle', margin:'5px'}}/>,
                        <RaisedButton icon={<FontAwesome name='copy' title='Duplicate scenario'/>} style={{minWidth:'15px', minHeight:'15px',height:'22px',width:'22px',fontSize:'10px', verticalAlign:'middle', margin:'5px'}} onClick={this.cloneScenario.bind(this)} disabled={!this.state.selectedScenario || this.props.loadingScenarios || this.props.loadingScenario} />,
                        <RaisedButton icon={<FontAwesome name='trash-alt' title='Delete scenario' style={{color:'red'}}/>} style={{minWidth:'15px', minHeight:'15px',height:'22px',width:'22px',fontSize:'10px', verticalAlign:'middle', margin:'5px'}} onClick={this._delete.bind(this)} disabled={!this.state.selectedScenario || this.props.loadingScenarios || this.props.loadingScenario} />,
                        <RaisedButton icon={<FontAwesome name='folder-open' title='Open scenario'/>} style={{minWidth:'15px', minHeight:'15px',height:'22px',width:'22px',fontSize:'10px', verticalAlign:'middle', margin:'5px'}} onClick={this.load.bind(this)} disabled={!this.state.selectedScenario || this.props.loadingScenarios || this.props.loadingScenario} />,
                        <RaisedButton label="OK" primary={true} onClick={this.props.closeScenariosDialog} disabled={this.props.loadingScenarios || this.props.loadingScenario} className="scenariosBtn" style={{minWidth:'15px', minHeight:'15px', height:'22px', fontSize:'10px', verticalAlign:'middle', margin:'5px'}}/>,
                    ]} 
                    open={this.props.open} 
                    onRequestClose={this.props.closeScenariosDialog} 
                    titleClassName={'dialogTitleStyle'} 
                    contentStyle={{width:'400px'}}
                />
            </React.Fragment>
        );
    }
}

export default ScenariosDialog;
