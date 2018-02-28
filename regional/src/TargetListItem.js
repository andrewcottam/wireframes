import * as React from 'react';
import IndicatorsDrawer from './IndicatorsDrawer.js';
import { ListItem } from 'material-ui/List';

class TargetListItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = { targetsOpen: false, indicatorsOpen: false };
    }

    indicatorSelected(e) {
        this.setState({ indicatorsOpen: false });
        this.props.indicatorSelected({ hierarchy: { indicatorListItem: e, targetListItem: this } });
    }

    handleClick() {
        this.setState({ indicatorsOpen: !this.state.indicatorsOpen });
    }

    render() {
        return (
            <React.Fragment>
                <ListItem primaryText={this.props.primaryText} secondaryText = {this.props.secondaryText} title={this.props.secondaryText} onClick={this.handleClick.bind(this)} disabled={this.props.disabled} style={{'fontStyle': this.props.disabled ? 'italic' : 'normal'}} />
                <IndicatorsDrawer indicators={this.props.indicators} open={this.state.indicatorsOpen} indicatorSelected={this.indicatorSelected.bind(this)}/>
            </React.Fragment>
        );
    }
}

export default TargetListItem;
