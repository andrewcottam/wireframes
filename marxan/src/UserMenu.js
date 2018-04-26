import React from 'react';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Popover from 'material-ui/Popover';
import FlatButton from 'material-ui/FlatButton';
import FontAwesome from 'react-fontawesome';

class UserMenu extends React.Component {
    render() {
        return (
            <React.Fragment>
              <FlatButton
                onClick={this.props.showUserMenu.bind(this)}
                label={this.props.user} 
                primary={true}
                labelStyle={{color:'white',textTransform:'',fontWeight:'400'}}
                style={{marginTop:'7px'}}
              />
              <Popover
                open={this.props.userMenuOpen} 
                anchorEl={this.props.anchorEl}
                anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                targetOrigin={{horizontal: 'left', vertical: 'top'}}
                onRequestClose={this.props.hideUserMenu.bind(this)}
              >
                <Menu desktop={true} menuItemStyle={{backgroundColor:'rgb(0, 188, 212)', color:'white'}} listStyle={{width:'120px',backgroundColor:'rgb(0, 188, 212)'}} selectedMenuItemStyle={{color:'rgb(24,24,24)'}} width={'102px'}>
                  <MenuItem primaryText="View scenarios"  leftIcon={<FontAwesome name='list-alt' style={{top:'8px'}}/>}/>
                  <MenuItem primaryText="Log out" onClick={this.props.logout.bind(this)} leftIcon={<FontAwesome name='sign-out-alt' style={{top:'8px'}}/>}/>
                </Menu>
              </Popover>
            </React.Fragment>
        );
    }
}

export default UserMenu;
