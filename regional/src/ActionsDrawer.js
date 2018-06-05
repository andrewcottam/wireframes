import * as React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Drawer from 'material-ui/Drawer';
import ActionsPanel from './ActionsPanel.js';

class ActionsDrawer extends React.Component {
    constructor(props) {
        super(props);
        this.state = { open: false };
    }

    buttonClick() {
        this.setState({ open: !this.state.open });
    }

    render() {
        return (
            <React.Fragment>
                <Drawer open={this.state.open} containerStyle={{'position': 'absolute', 'top': '0px', 'paddingTop': '64px', 'zIndex':'1'}} width={300} openSecondary={true}>
                    <ActionsPanel {...this.props}/>
                </Drawer>
                <RaisedButton label="Actions" secondary={true} style={{"transform":"rotate(270deg)",'right': (this.state.open) ? '274px' : '-27px','top': '431px','position': 'absolute'}} onClick={this.buttonClick.bind(this)}/>
            </React.Fragment>
        );
    }
}

export default ActionsDrawer;
