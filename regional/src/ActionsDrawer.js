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
            <Drawer open={this.state.open} containerStyle={{'position': 'absolute', 'top': '64px','overflow':'none'}} width={460} openSecondary={true}>
                <RaisedButton label="Actions" secondary={true} style={{"transform":"rotate(270deg)",'left': '-63px','top': '348px','position': 'absolute'}} onClick={this.buttonClick.bind(this)}/>
                <ActionsPanel {...this.props}/>
            </Drawer>
        );
    }
}

export default ActionsDrawer;
