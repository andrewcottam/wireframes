import * as React from 'react';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import TargetListItem from './TargetListItem.js';
import Drawer from 'material-ui/Drawer';

class TargetsDrawer extends React.Component {
    render() {
        let containerStyle = {
            'position': 'absolute',
            'overflow': 'none',
            'left': (this.props.open ? '60px' : '0px')
        };
        const targets = this.props.targets && this.props.targets.map((target) => {
            return <TargetListItem primaryText={target.props.primaryText} key={target.props.primaryText} secondaryText={target.props.secondaryText} indicators={target.props.indicators} disabled={target.props.disabled} indicatorSelected={this.props.indicatorSelected.bind(this)}/>;
        });
        return (
            <React.Fragment>
                <Drawer containerStyle={containerStyle} width={360} open={this.props.open}>
                    <Subheader>Targets</Subheader>
                    <Divider/>
                    <div>{targets}</div>
                </Drawer>
            </React.Fragment>
        );
    }
}

export default TargetsDrawer;
