import React from 'react';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Popover from 'material-ui/Popover';
import FlatButton from 'material-ui/FlatButton';
import FontAwesome from 'react-fontawesome';
import OptionsDialog from './OptionsDialog.js';
import UserDialog from './UserDialog.js';

class UserMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = { userDialogOpen: false };
  }
  openOptionsDialog() {
    this.props.hideUserMenu();
    this.props.hidePopup();
    this.props.openOptionsDialog();
  }
  openUserDialog() {
    this.setState({ userDialogOpen: true });
    this.props.hideUserMenu();
  }
  closeUserDialog() {
    this.setState({ userDialogOpen: false });
  }
  render() {
    return (
      <React.Fragment>
      <FlatButton
        onClick={this.props.showUserMenu.bind(this)}
        primary={true}
        style={{position: 'absolute',display:'block',top:'27px',right:'34px', minWidth:'0px'}}
        onMouseEnter={this.props.onMouseEnter}
        title={"Logged in as " + this.props.user}
        icon={<FontAwesome name='user' style={{top:'8px','color':'white'}}/>}
      />
      <Popover
        open={this.props.userMenuOpen} 
        anchorEl={this.props.anchorEl}
        anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
        targetOrigin={{horizontal: 'left', vertical: 'top'}}
        onRequestClose={this.props.hideUserMenu.bind(this)}
      >
        <Menu desktop={true} menuItemStyle={{backgroundColor:'rgb(0, 188, 212)', color:'white'}} listStyle={{width:'120px',backgroundColor:'rgb(0, 188, 212)'}} selectedMenuItemStyle={{color:'rgb(24,24,24)'}} width={'102px'}>
          <MenuItem primaryText={"Logged in as " + this.props.user}/>
          <MenuItem primaryText="Options" onClick={this.openOptionsDialog.bind(this)} leftIcon={<FontAwesome name='cog' style={{top:'8px'}}/>}/>
          <MenuItem primaryText="Profile" onClick={this.openUserDialog.bind(this)} leftIcon={<FontAwesome name='user' style={{top:'8px'}}/>}/>
          <MenuItem primaryText="Log out" onClick={this.props.logout.bind(this)} leftIcon={<FontAwesome name='sign-out-alt' style={{top:'8px'}}/>}/>
        </Menu>
      </Popover>
      <OptionsDialog 
        userData={this.props.userData}
        open={this.props.optionsDialogOpen}
        closeOptionsDialog={this.props.closeOptionsDialog}
        saveOptions={this.props.saveOptions}
        savingOptions={this.props.savingOptions}
      />
      <UserDialog 
        userData={this.props.userData}
        open={this.state.userDialogOpen}
        closeUserDialog={this.closeUserDialog.bind(this)}
        updateUser={this.props.updateUser}
      />
    </React.Fragment>
    );
  }
}

export default UserMenu;
