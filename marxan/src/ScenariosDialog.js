import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import { List, ListItem, makeSelectable } from 'material-ui/List';
import NewScenarioDialog from './NewScenarioDialog.js';
import FontAwesome from 'react-fontawesome'; 

let SelectableList = makeSelectable(List);

function wrapState(ComposedComponent) {
    return class SelectableList extends Component {
        static propTypes = {
            children: PropTypes.node.isRequired,
            defaultValue: PropTypes.number.isRequired,
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
        this.state = { newScenarioDialogOpen: false, selectedScenario: undefined };
    }
    _delete() {
        this.props.deleteScenario(this.state.selectedScenario);
        this.setState({ selectedScenario: false });
    }
    load() {
        this.props.loadScenario(this.state.selectedScenario);
    }
    _new() {
        this.setState({ newScenarioDialogOpen: true });
    }
    closeNewScenarioDialog() {
        this.setState({ newScenarioDialogOpen: false });
    }
    changeScenario(event, scenario) {
        this.setState({ selectedScenario: scenario });
    }
    render() {
        const actions = [
            <RaisedButton label="Close" primary={true} onClick={this.props.closeScenariosDialog} disabled={this.props.loadingScenarios || this.props.loadingScenario} className="scenariosBtn"/>,
            <RaisedButton label="Delete" primary={true} onClick={this._delete.bind(this)} disabled={!this.state.selectedScenario || this.props.loadingScenarios || this.props.loadingScenario} className="scenariosBtn"/>,
            <RaisedButton label="Load" primary={true} onClick={this.load.bind(this)} disabled={!this.state.selectedScenario || this.props.loadingScenarios || this.props.loadingScenario} className="scenariosBtn"/>,
            <RaisedButton label="New" primary={true} keyboardFocused={true} onClick={this._new.bind(this)} disabled={this.props.loadingScenarios || this.props.loadingScenario} className="scenariosBtn"/>,
        ];
        let listitems = this.props.scenarios && this.props.scenarios.map((scenario) => {
            let primary = <div style={{fontSize:'13px'}}>{scenario.name}</div>;
            let secondary = <div style={{fontSize:'12px'}}>{scenario.description + " (created: " + scenario.createdate + ")"}</div>;
            return (<ListItem key={scenario.name} value={scenario.name} primaryText={primary} secondaryText={secondary} />);
        });
        if (!listitems) listitems = <div></div>; //to stop console warnings

        let c = <React.Fragment>
            <SelectableList defaultValue ={0} children={listitems} changeScenario={this.changeScenario.bind(this)} style={{'height':'600px'}}/>
            <div id="spinner"><FontAwesome spin name='sync' style={{'display': (this.props.loadingScenarios || this.props.loadingScenario ? 'inline-block' : 'none')}} className={'scenarioSpinner'}/></div>
        </React.Fragment>;

        return (
            <React.Fragment>
                <Dialog overlayStyle={{display:'none'}} className={'dialog'} children={c} title="Scenarios" actions={actions} open={this.props.open} onRequestClose={this.props.closeScenariosDialog} contentStyle={{width:'566px'}}/>
                <NewScenarioDialog 
                newScenarioDialogOpen={this.state.newScenarioDialogOpen} 
                closeNewScenarioDialog={this.closeNewScenarioDialog.bind(this)}
                createNewScenario={this.props.createNewScenario}
                />
            </React.Fragment>
        );
    }
}

export default ScenariosDialog;
