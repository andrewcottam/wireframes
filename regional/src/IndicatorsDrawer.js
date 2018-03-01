import * as React from 'react';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import Drawer from 'material-ui/Drawer';
import IndicatorListItem from './IndicatorListItem.js';

class IndicatorsDrawer extends React.Component {
    render() {
        let containerStyle = { 'position': 'absolute', 'overflow': 'none', 'left': (this.props.open ? '62px' : '-62px') };
        const indicators = this.props.indicators && this.props.indicators.map((indicator) => {
            return <IndicatorListItem {...this.props} desc={indicator.props.desc} primaryText={indicator.props.primaryText} id={indicator.props.id} key={indicator.props.primaryText} secondaryText={indicator.props.secondaryText} onClick={this.props.indicatorSelected}/>;
        });
        return (
            <React.Fragment>
                <Drawer containerStyle={containerStyle} width={360} open={this.props.open}>
                    <Subheader>Indicators</Subheader>
                    <Divider/>
                    <div>{indicators}</div>
                </Drawer>
            </React.Fragment>
        );
    }
}

export default IndicatorsDrawer;
