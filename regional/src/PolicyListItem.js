import * as React from 'react';
import Avatar from 'material-ui/Avatar';
import TargetsDrawer from './TargetsDrawer.js';
import { ListItem } from 'material-ui/List';

class PolicyListItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = { targetsOpen: false };
    }

    indicatorSelected(e) {
        this.setState({ targetsOpen: false });
        let hierarchy = Object.assign({}, e.hierarchy, { policyListItem: this });
        this.props.onIndicatorSelected(hierarchy);
    }

    handleClick() {
        this.setState({ targetsOpen: !this.state.targetsOpen });
    }

    render() {
        return (
            <React.Fragment>
                <ListItem primaryText={this.props.primaryText} secondaryText={this.props.secondaryText} leftAvatar={<Avatar src={this.props.leftAvatarSrc}/>} onClick={this.handleClick.bind(this)}/>
                <TargetsDrawer {...this.props} targets={this.props.targets} open={this.state.targetsOpen} indicatorSelected={this.indicatorSelected.bind(this)}/>
            </React.Fragment>
        );
    }
}

export default PolicyListItem;
