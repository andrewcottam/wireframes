import * as React from 'react';
import { List, ListItem } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';

class TargetItem extends React.Component {
    render() {
        return (
            <List style={{padding:'0px'}}>
                <ListItem {...this.props} className="TargetItem" leftAvatar={(this.props.avatar ? <Avatar src={this.props.avatar}/> : null)}></ListItem>
            </List>
        );
    }
}

export default TargetItem;
