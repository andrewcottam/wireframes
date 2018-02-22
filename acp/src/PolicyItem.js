import * as React from 'react';
import { List, ListItem } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';

class PolicyItem extends React.Component {
    render() {
        return (
            <List style={{padding:'0px'}}>
                <ListItem {...this.props} leftAvatar={<Avatar src={this.props.avatar}/>}></ListItem>
            </List>
        );
    }
}

export default PolicyItem;
