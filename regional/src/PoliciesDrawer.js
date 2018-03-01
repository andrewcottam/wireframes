import * as React from 'react';
import Drawer from 'material-ui/Drawer';
import RaisedButton from 'material-ui/RaisedButton';
import PoliciesPanel from './PoliciesPanel.js';

class PoliciesDrawer extends React.Component {
    constructor(props) {
        super(props);
        this.state = { open: false};
    }

    buttonClick() {
        this.setState({ open: !this.state.open });
    }
    onIndicatorSelected(e){
        this.setState({ open: false });
    }
    render() {
        return (
            <React.Fragment>
                <Drawer open={this.state.open} onRequestChange={(open) => this.setState({open})} containerStyle={{'position': 'absolute', 'top': '64px','overflow':'none'}} width={360}>
                  <RaisedButton label="Knowledge" secondary={true} style={{"transform":"rotate(270deg)",'left': '319px','top': '360px','position': 'absolute'}} onClick={this.buttonClick.bind(this)}/>
                  <PoliciesPanel {...this.props} onIndicatorSelected={this.onIndicatorSelected.bind(this)}/>
                </Drawer>;
            </React.Fragment>
        );
    }
}

export default PoliciesDrawer;
