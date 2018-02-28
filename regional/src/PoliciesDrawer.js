import * as React from 'react';
import Drawer from 'material-ui/Drawer';
import RaisedButton from 'material-ui/RaisedButton';
import PoliciesPanel from './PoliciesPanel.js';
import IndicatorChart from './IndicatorChart.js';

class PoliciesDrawer extends React.Component {
    constructor(props) {
        super(props);
        this.state = { open: true, indicatorOpen: false, activeIndicator: null };
    }

    buttonClick() {
        this.setState({ open: !this.state.open });
    }

    showIndicator(e) {
        this.setState({ open: false, indicatorOpen: true, activeIndicator: e });
    }

    hideIndicator(e) {
        // this.setState({ indicatorOpen: false });
    }

    render() {
        return (
            <React.Fragment>
                <Drawer open={this.state.open} onRequestChange={(open) => this.setState({open})} containerStyle={{'position': 'absolute', 'top': '64px','overflow':'none'}} width={360}>
                  <RaisedButton label="Knowledge" secondary={true} style={{"transform":"rotate(270deg)",'left': '319px','top': '360px','position': 'absolute'}} onClick={this.buttonClick.bind(this)}/>
                  <PoliciesPanel onIndicatorSelected={this.showIndicator.bind(this)}/>
                </Drawer>;
                <IndicatorChart isOpen={this.state.indicatorOpen} indicator={this.state.activeIndicator} map={this.props.map}/>
            </React.Fragment>
        );
    }
}

export default PoliciesDrawer;
