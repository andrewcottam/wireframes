import * as React from 'react';
import Dialog from 'material-ui/Dialog';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import ActionSpatialData from './ActionSpatialData.js';
import ActionSpeciesObservations from './ActionSpeciesObservations.js';
import ActionPhotos from './ActionPhotos.js';
import ActionDigitiseFeatures from './ActionDigitiseFeatures.js';
import ActionProtectedAreaBoundaries from './ActionProtectedAreaBoundaries.js';
import ActionManagementEffectivenessData from './ActionManagementEffectivenessData.js';
import ActionViewActionFundProposals from './ActionViewActionFundProposals.js';

function ActionsHeader(props) {
    return (
        <Subheader>{props.text}</Subheader>
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
    digitiseFeatures() {
        this.setState({ open: true });
    }
    render() {
        return (
            <List>
                <ActionsHeader text="Analyse"/>
                <ActionsHeader text="Contribute"/>
                <ActionListItem primaryText="Spatial data" onClick={()=>this.setState({action:'spatialData'})}/>
                <ActionListItem primaryText="Species observations" onClick={()=>this.setState({action:'speciesObservations'})}/>
                <ActionListItem primaryText="Photos" onClick={()=>this.setState({action:'photos'})}/>
                <ActionListItem primaryText="Digitise features" onClick={()=>this.setState({action:'digitiseFeatures'})}/>
                <ActionListItem primaryText="Protected area boundaries" onClick={()=>this.setState({action:'protectedAreaBoundaries'})}/>
                <ActionListItem primaryText="Management effectiveness data" onClick={()=>this.setState({action:'managementEffectivenessData'})}/>
                <ActionsHeader text="Fund"/>
                <ActionListItem primaryText="View Action Fund proposals" onClick={()=>this.setState({action:'viewActionFundProposals'})}/>
                <ActionsHeader text="Network"/>
                <ActionsHeader text="Reports"/>
                <Dialog title="Spatial data" open={this.state.action==='spatialData'} actions={<ActionSpatialData closeDialog={this.handleClose.bind(this)}/>} overlayStyle={{backgroundColor: 'transparent'}} onRequestClose={this.handleClose.bind(this)} modal={false} />
                <Dialog title="Species observations" open={this.state.action==='speciesObservations'} actions={<ActionSpeciesObservations closeDialog={this.handleClose.bind(this)}/>} overlayStyle={{backgroundColor: 'transparent'}} onRequestClose={this.handleClose.bind(this)} modal={false} />
                <Dialog title="Photos" open={this.state.action==='photos'} actions={<ActionPhotos closeDialog={this.handleClose.bind(this)}/>} overlayStyle={{backgroundColor: 'transparent'}} onRequestClose={this.handleClose.bind(this)} modal={false} />
                <Dialog title="Digitise Features" open={this.state.action==='digitiseFeatures'} actions={<ActionDigitiseFeatures closeDialog={this.handleClose.bind(this)}/>} overlayStyle={{backgroundColor: 'transparent'}} onRequestClose={this.handleClose.bind(this)} modal={false} />
                <Dialog title="Protected area boundaries" open={this.state.action==='protectedAreaBoundaries'} actions={<ActionProtectedAreaBoundaries closeDialog={this.handleClose.bind(this)}/>} overlayStyle={{backgroundColor: 'transparent'}} onRequestClose={this.handleClose.bind(this)} modal={false} />
                <Dialog title="Management effectiveness data" open={this.state.action==='managementEffectivenessData'} actions={<ActionManagementEffectivenessData closeDialog={this.handleClose.bind(this)}/>} overlayStyle={{backgroundColor: 'transparent'}} onRequestClose={this.handleClose.bind(this)} modal={false} />
                <Dialog title="View Action Fund proposals" open={this.state.action==='viewActionFundProposals'} actions={<ActionViewActionFundProposals closeDialog={this.handleClose.bind(this)}/>} overlayStyle={{backgroundColor: 'transparent'}} onRequestClose={this.handleClose.bind(this)} modal={false} />
            </List>
        );
    }
}

export default ActionsPanel;
