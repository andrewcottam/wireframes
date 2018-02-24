import * as React from 'react';
import { List, ListItem } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';

class PolicyItem extends React.Component {
    render() {
        return (
            <React.Fragment>
                <List style={{padding:'0px'}}>
                    <ListItem {...this.props} leftAvatar={<Avatar src={this.props.avatar}/>}></ListItem>
                </List>
                <Divider/>
            </React.Fragment>
        );
    }
}

export default PolicyItem;
