import * as React from 'react';
import { List, ListItem } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';

class TargetsHeader extends React.Component {
    render() {
        return (
            <React.Fragment>
                    <List style={{padding:0}}>
                        <ListItem {...this.props} style={{backgroundColor:'rgba(0, 0, 0, 0.1)'}} leftAvatar={<Avatar src={this.props.avatar}/>}/>
                    </List>
              <Divider/>
              </React.Fragment>);
    }
}

export default TargetsHeader;
