import React from 'react';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Popover from 'material-ui/Popover';
import FlatButton from 'material-ui/FlatButton';
import FontAwesome from 'react-fontawesome';
import ScenariosDialog from './ScenariosDialog.js';
import OptionsDialog from './OptionsDialog.js';

class UserMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = { scenariosDialogOpen: false, optionsDialogOpen: false };
  }
  componentDidUpdate(prevProps) {
    if (prevProps.loadingScenario && this.props.loadingScenario === false) {
      this.closeScenariosDialog();
    }
  }
  openScenariosDialog() {
    this.setState({ scenariosDialogOpen: true });
    this.props.listScenarios();
    this.props.hideUserMenu();
  }
  closeScenariosDialog() {
    this.setState({ scenariosDialogOpen: false });
  }
  openOptionsDialog() {
    this.setState({ optionsDialogOpen: true });
    this.props.hideUserMenu();
  }
  closeOptionsDialog() {
    this.setState({ optionsDialogOpen: false });
  }
  loadScenario(scenario) {
    this.props.loadScenario(scenario);
  }
  render() {
    return (
      <React.Fragment>
              <FlatButton
                onClick={this.props.showUserMenu.bind(this)}
                label={this.props.user ? this.props.user : 'not logged in'} 
                primary={true}
                labelStyle={{color:'white',textTransform:'',fontWeight:'400'}}
                style={{marginTop:'7px', display: this.props.loggedIn ? 'block' : 'none'}}
                onMouseEnter={this.props.onMouseEnter}
              />
              <Popover
                open={this.props.userMenuOpen} 
                anchorEl={this.props.anchorEl}
                anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                targetOrigin={{horizontal: 'left', vertical: 'top'}}
                onRequestClose={this.props.hideUserMenu.bind(this)}
              >
                <Menu desktop={true} menuItemStyle={{backgroundColor:'rgb(0, 188, 212)', color:'white'}} listStyle={{width:'120px',backgroundColor:'rgb(0, 188, 212)'}} selectedMenuItemStyle={{color:'rgb(24,24,24)'}} width={'102px'}>
                  <MenuItem primaryText="Scenarios" onClick={this.openScenariosDialog.bind(this)} leftIcon={<FontAwesome name='list-alt' style={{top:'8px'}}/>}/>
                  <MenuItem primaryText="Options" onClick={this.openOptionsDialog.bind(this)} leftIcon={<FontAwesome name='list-alt' style={{top:'8px'}}/>}/>
                  <MenuItem primaryText="Log out" onClick={this.props.logout.bind(this)} leftIcon={<FontAwesome name='sign-out-alt' style={{top:'8px'}}/>}/>
                </Menu>
              </Popover>
              <ScenariosDialog 
                open={this.state.scenariosDialogOpen} 
                loadingScenarios={this.props.loadingScenarios}
                loadingScenario={this.props.loadingScenario}
                closeScenariosDialog={this.closeScenariosDialog.bind(this)}
                scenarios={this.props.scenarios}
                createNewScenario={this.props.createNewScenario}
                deleteScenario={this.props.deleteScenario}
                loadScenario={this.loadScenario.bind(this)}
              />
              <OptionsDialog 
                open={this.state.optionsDialogOpen}
                closeOptionsDialog={this.closeOptionsDialog.bind(this)}
                setShowPopupOption={this.props.setShowPopupOption}
              />
            </React.Fragment>
    );
  }
}

export default UserMenu;
