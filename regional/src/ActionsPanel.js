import * as React from 'react';
import Dialog from 'material-ui/Dialog';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import HorizontalLinearStepper from './HorizontalLinearStepper.js';

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
        this.setState({ digitisingFeatures: false });
    }
    digitiseFeatures() {
        this.setState({ open: true });
    }
    render() {
        return (
            <List>
                <ActionsHeader text="Analyse"/>
                <ActionsHeader text="Contribute"/>
                <ActionListItem primaryText="Spatial data" onClick={this.log}/>
                <ActionListItem primaryText="Species observations" onClick={this.log}/>
                <ActionListItem primaryText="Photos" onClick={this.log}/>
                <ActionListItem primaryText="Digitise features" onClick={()=>this.setState({digitisingFeatures:true})}/>
                <ActionListItem primaryText="Protected area boundaries" onClick={this.log}/>
                <ActionListItem primaryText="Management effectiveness data" onClick={this.log}/>
                <ActionsHeader text="Fund"/>
                <ActionListItem primaryText="View Action Fund proposals" onClick={this.log}/>
                <ActionsHeader text="Network"/>
                <ActionsHeader text="Reports"/>
                <Dialog title="Digitise Features" open={this.state.digitisingFeatures} actions={<HorizontalLinearStepper closeDialog={this.handleClose.bind(this)}/>} overlayStyle={{backgroundColor: 'transparent'}} onRequestClose={this.handleClose.bind(this)} modal={false} />
            </List>
        );
    }
}

export default ActionsPanel;
