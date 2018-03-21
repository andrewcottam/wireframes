import * as React from 'react';
import Dialog from 'material-ui/Dialog';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import ActionShowRecentImagery from './ActionShowRecentImagery.js';
import ActionShowActionFundProposals from './ActionShowActionFundProposals.js';
import ActionSpatialData from './ActionSpatialData.js';
import ActionSpeciesObservations from './ActionSpeciesObservations.js';
import ActionPhotos from './ActionPhotos.js';
import ActionDigitiseFeatures from './ActionDigitiseFeatures.js';
import ActionProtectedAreaBoundaries from './ActionProtectedAreaBoundaries.js';
import ActionManagementEffectivenessData from './ActionManagementEffectivenessData.js';
import ActionIncident from './ActionIncident.js';
import ActionProvincial from './ActionProvincial.js';
import ActionEnforcement from './ActionEnforcement.js';
import ActionGapAnalysis from './ActionGapAnalysis.js';
import ActionSDM from './ActionSDM.js';
import ActionLCC from './ActionLCC.js';
import Divider from 'material-ui/Divider';

function ActionsHeader(props) {
    return (
        <React.Fragment>
            <Subheader>{props.text}</Subheader>
            <Divider/>
        </React.Fragment>
    );
}

function ActionListItem(props) {
    return (
        <ListItem primaryText={props.primaryText} onClick={props.onClick} />
    );
}

class ActionsPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = { digitisingFeatures: false };
    }
    handleClose() {
        this.setState({ action: '' });
    }
    render() {
        return (
            <List>
                <ActionsHeader text="Analyse"/>
                <ActionListItem primaryText="Gap analysis" onClick={()=>this.setState({action:'gapAnalysis'})}/>
                <ActionListItem primaryText="Land Cover Change analysis" onClick={()=>this.setState({action:'lcc'})}/>
                <ActionShowRecentImagery map={this.props.map}/>
                <ActionListItem primaryText="Species Distribution Modelling" onClick={()=>this.setState({action:'sdm'})}/>
                <ActionsHeader text="Contribute"/>
                <ActionListItem primaryText="Digitise features" onClick={()=>this.setState({action:'digitiseFeatures'})}/>
                <ActionListItem primaryText="Management effectiveness data" onClick={()=>this.setState({action:'managementEffectivenessData'})}/>
                <ActionListItem primaryText="Photos" onClick={()=>this.setState({action:'photos'})}/>
                <ActionListItem primaryText="Protected area boundaries" onClick={()=>this.setState({action:'protectedAreaBoundaries'})}/>
                <ActionListItem primaryText="Spatial data" onClick={()=>this.setState({action:'spatialData'})}/>
                <ActionListItem primaryText="Species observations" onClick={()=>this.setState({action:'speciesObservations'})}/>
                <ActionsHeader text="Fund"/>
                <ActionShowActionFundProposals {...this.props}/>
                <ActionListItem primaryText="Show existing funded projects" onClick={()=>this.setState({action:'existingProjects'})}/>
                <ActionsHeader text="Network"/>
                <ActionListItem primaryText="Contact enforcement agencies" onClick={()=>this.setState({action:'contactEnforcementAgencies'})}/>
                <ActionListItem primaryText="Contact provincial body" onClick={()=>this.setState({action:'contactProvincialBody'})}/>
                <ActionListItem primaryText="Report incident" onClick={()=>this.setState({action:'reportIncident'})}/>
                <ActionsHeader text="Reports"/>
                <Dialog title="Spatial data" open={this.state.action==='spatialData'} actions={<ActionSpatialData closeDialog={this.handleClose.bind(this)}/>} overlayStyle={{backgroundColor: 'transparent'}} onRequestClose={this.handleClose.bind(this)} modal={false} />
                <Dialog title="Species observations" open={this.state.action==='speciesObservations'} actions={<ActionSpeciesObservations closeDialog={this.handleClose.bind(this)}/>} overlayStyle={{backgroundColor: 'transparent'}} onRequestClose={this.handleClose.bind(this)} modal={false} />
                <Dialog title="Photos" open={this.state.action==='photos'} actions={<ActionPhotos closeDialog={this.handleClose.bind(this)}/>} overlayStyle={{backgroundColor: 'transparent'}} onRequestClose={this.handleClose.bind(this)} modal={false} />
                <Dialog title="Digitise Features" open={this.state.action==='digitiseFeatures'} actions={<ActionDigitiseFeatures closeDialog={this.handleClose.bind(this)}/>} overlayStyle={{backgroundColor: 'transparent'}} onRequestClose={this.handleClose.bind(this)} modal={false} />
                <Dialog title="Protected area boundaries" open={this.state.action==='protectedAreaBoundaries'} actions={<ActionProtectedAreaBoundaries closeDialog={this.handleClose.bind(this)}/>} overlayStyle={{backgroundColor: 'transparent'}} onRequestClose={this.handleClose.bind(this)} modal={false} />
                <Dialog title="Management effectiveness data" open={this.state.action==='managementEffectivenessData'} actions={<ActionManagementEffectivenessData closeDialog={this.handleClose.bind(this)}/>} overlayStyle={{backgroundColor: 'transparent'}} onRequestClose={this.handleClose.bind(this)} modal={false} />
                <Dialog title="View Action Fund proposals" open={this.state.action==='viewActionFundProposals'} actions={<ActionShowActionFundProposals closeDialog={this.handleClose.bind(this)}/>} overlayStyle={{backgroundColor: 'transparent'}} onRequestClose={this.handleClose.bind(this)} modal={false} />
                <Dialog title="Report incident" open={this.state.action==='reportIncident'} actions={<ActionIncident closeDialog={this.handleClose.bind(this)}/>} overlayStyle={{backgroundColor: 'transparent'}} onRequestClose={this.handleClose.bind(this)} modal={false} />
                <Dialog title="Contact provincial body" open={this.state.action==='contactProvincialBody'} actions={<ActionProvincial closeDialog={this.handleClose.bind(this)}/>} overlayStyle={{backgroundColor: 'transparent'}} onRequestClose={this.handleClose.bind(this)} modal={false} />
                <Dialog title="Contact enforcement agencies" open={this.state.action==='contactEnforcementAgencies'} actions={<ActionEnforcement closeDialog={this.handleClose.bind(this)}/>} overlayStyle={{backgroundColor: 'transparent'}} onRequestClose={this.handleClose.bind(this)} modal={false} />
                <Dialog title="Gap analysis" open={this.state.action==='gapAnalysis'} actions={<ActionGapAnalysis closeDialog={this.handleClose.bind(this)}/>} overlayStyle={{backgroundColor: 'transparent'}} onRequestClose={this.handleClose.bind(this)} modal={false} />
                <Dialog title="Species Distribution Modelling" open={this.state.action==='sdm'} actions={<ActionSDM closeDialog={this.handleClose.bind(this)}/>} overlayStyle={{backgroundColor: 'transparent'}} onRequestClose={this.handleClose.bind(this)} modal={false} />
                <Dialog title="Land Cover Change analysis" open={this.state.action==='lcc'} actions={<ActionLCC closeDialog={this.handleClose.bind(this)}/>} overlayStyle={{backgroundColor: 'transparent'}} onRequestClose={this.handleClose.bind(this)} modal={false} />
            </List>
        );
    }
}
export default ActionsPanel;
