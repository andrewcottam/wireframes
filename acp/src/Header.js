import * as React from 'react';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';

class Header extends React.Component {
    render() {
        return (
            <React.Fragment>
                    <List style={{padding:0}}>
                        <ListItem style={{backgroundColor:'rgba(0, 0, 0, 0.1)'}}>{this.props.title}</ListItem>
                    </List>
              <Divider/>
              </React.Fragment>
        )
    }
}

export default Header;
