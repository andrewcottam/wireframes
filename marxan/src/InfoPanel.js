import React from 'react';
import 'react-table/react-table.css';
import Paper from 'material-ui/Paper';
import { Tabs, Tab } from 'material-ui/Tabs';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import UserMenu from './UserMenu.js';
import SelectField from 'material-ui/SelectField';
import SelectInterestFeatures from './newCaseStudySteps/SelectInterestFeatures';
import MenuItem from 'material-ui/MenuItem';
import ScenariosDialog from './ScenariosDialog.js';
import Menu from 'material-ui/svg-icons/navigation/menu';
import Texture from 'material-ui/svg-icons/image/texture';
import Settings from 'material-ui/svg-icons/action/settings';
import {white} from 'material-ui/styles/colors';

class InfoPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = { scenariosDialogOpen: false, puEditing: false };
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    //if the input box for renaming the scenario has been made visible and it has no value, then initialise it with the scenario name and focus it
    if (prevProps.editingScenarioName === false && this.props.editingScenarioName) {
      document.getElementById("scenarioName").value = this.props.scenario;
      document.getElementById("scenarioName").focus();
    }
    //if the input box for renaming the description has been made visible and it has no value, then initialise it with the description and focus it
    if (prevProps.editingDescription === false && this.props.editingDescription) {
      document.getElementById("descriptionEdit").value = this.props.metadata.DESCRIPTION;
      document.getElementById("descriptionEdit").focus();
    }
    if (prevProps.loadingScenario && this.props.loadingScenario === false) {
      this.closeScenariosDialog();
    }
  }
  openScenariosDialog() {
    this.setState({ scenariosDialogOpen: true });
    this.props.listScenarios();
  }
  closeScenariosDialog() {
    this.setState({ scenariosDialogOpen: false });
  }
  loadScenario(scenario) {
    this.props.loadScenario(scenario);
  }
  showUserMenu(e) {
    e.preventDefault();
    this.setState({ userMenuOpen: true, anchorEl: e.currentTarget });
  }
  hideUserMenu(e) {
    e && e.preventDefault && e.preventDefault();
    this.setState({ userMenuOpen: false });
  }
  logout() {
    this.hideUserMenu();
    this.props.logout();
  }

  onKeyPress(e) {
    if (e.nativeEvent.keyCode === 13 || e.nativeEvent.keyCode === 27) {
      document.getElementById(e.nativeEvent.target.id).blur(); //call the onBlur event which will call the REST service to rename the scenario
    }
  }

  onBlur(e) {
    if (e.nativeEvent.target.id === 'scenarioName') {
      this.props.renameScenario(e.target.value);
    }
    else {
      this.props.renameDescription(e.target.value);
    }
  }

  startEditingScenarioName() {
    if (this.props.scenario) { //a scenario may not be loaded
      this.props.startEditingScenarioName();
    }
  }
  startEditingDescription() {
    if (this.props.scenario) { //a scenario may not be loaded
      this.props.startEditingDescription();
    }
  }
  scenario_tab_active() {
    this.props.scenario_tab_active();
  }
  features_tab_active() {
    this.props.features_tab_active();
  }
  pu_tab_active() {
    this.props.pu_tab_active();
  }
  startStopPuEditSession() {
    (this.state.puEditing) ? this.stopPuEditSession(): this.startPuEditSession();
  }
  startPuEditSession() {
    this.setState({ puEditing: true });
    this.props.startPuEditSession();
  }

  stopPuEditSession() {
    this.setState({ puEditing: false });
    this.props.stopPuEditSession();
  }
  showSettingsDialog() {
    this.props.showSettingsDialog();
  }

  render() {
    var puEditIconColor = this.state.puEditing ? "rgb(255, 64, 129)" : "rgba(0, 0, 0, 0.87)";
    return (
      <React.Fragment>
        <div className={'infoPanel'} style={{display: this.props.loggedIn ? 'block' : 'none'}}>
          <Paper zDepth={2} className="InfoPanelPaper">
            <Paper zDepth={2} className="titleBar">
              <IconButton title="Click to open scenarios" onClick={this.openScenariosDialog.bind(this)} className="iconButton scenarioButton">
                <Menu color={white}/>
              </IconButton>
              <span onClick={this.startEditingScenarioName.bind(this)} className={'scenarioNameEditBox'} title="Click to rename the scenario">{this.props.scenario}</span>
              <input id="scenarioName" style={{position:'absolute', 'display': (this.props.editingScenarioName) ? 'block' : 'none',left:'63px',top:'33px',border:'1px lightgray solid'}} className={'scenarioNameEditBox'} onKeyPress={this.onKeyPress.bind(this)} onBlur={this.onBlur.bind(this)}/>
              <UserMenu 
                    user={ this.props.user} 
                    userData={this.props.userData}
                    loggedIn={this.props.loggedIn}
                    onMouseEnter={this.showUserMenu.bind(this)} 
                    showUserMenu={this.showUserMenu.bind(this)} 
                    userMenuOpen={this.state.userMenuOpen} 
                    anchorEl={this.state.anchorEl} 
                    hideUserMenu={this.hideUserMenu.bind(this)} 
                    logout={this.logout.bind(this)}
                    loadingScenario={this.props.loadingScenario}
                    loadingScenarios={this.props.loadingScenarios}
                    listScenarios={this.props.listScenarios}
                    scenarios={this.props.scenarios}
                    scenario={this.props.scenario}
                    createNewScenario={this.props.createNewScenario} 
                    deleteScenario={this.props.deleteScenario}
                    loadScenario={this.props.loadScenario}
                    cloneScenario={this.props.cloneScenario}
                    saveOptions={this.props.saveOptions}
                    savingOptions={this.props.savingOptions}
                    openOptionsDialog={this.props.openOptionsDialog}
                    closeOptionsDialog={this.props.closeOptionsDialog}
                    optionsDialogOpen={this.props.optionsDialogOpen}
                    openNewCaseStudyDialog={this.props.openNewCaseStudyDialog}
                    hidePopup={this.props.hidePopup}
                    updateUser={this.props.updateUser}
                    openImportWizard={this.props.openImportWizard}
              />
            </Paper>
            <Tabs contentContainerStyle={{'margin':'20px'}} className={'tabs'}>
              <Tab label="Scenario" onActive={this.scenario_tab_active.bind(this)}>
                <div>
                  <div className={'tabTitle'}>Description</div>
                  <input id="descriptionEdit" style={{'display': (this.props.editingDescription) ? 'block' : 'none'}} className={'descriptionEditBox'} onKeyPress={this.onKeyPress.bind(this)} onBlur={this.onBlur.bind(this)}/>
                  <div className={'description'} onClick={this.startEditingDescription.bind(this)} style={{'display': (!this.props.editingDescription) ? 'block' : 'none'}}>{this.props.metadata.DESCRIPTION}</div>
                  <div className={'tabTitle'} style={{marginTop:'10px'}}>Created</div>
                  <div className={'createDate'}>{this.props.metadata.CREATEDATE}</div>
                </div>
              </Tab>
              <Tab label="Features" onActive={this.features_tab_active.bind(this)}>
                <SelectInterestFeatures
                  scenarioFeatures={this.props.scenarioFeatures}
                  updateTargetValue={this.props.updateTargetValue}
                  preprocessFeature={this.props.preprocessFeature}
                  openAllInterestFeaturesDialog={this.props.openAllInterestFeaturesDialog}
                />
              </Tab>
              <Tab label="Planning units" onActive={this.pu_tab_active.bind(this)}>
                <div>
                  <div className={'tabTitle'}>Planning area</div>
                  <div>{this.props.metadata.pu_alias}</div>
                  <div className={'tabTitle'} style={{'marginTop': '25px'}}>Protected areas</div>
                  <SelectField floatingLabelText={'Include'} floatingLabelFixed={true} value={'None'} children={<MenuItem value={'None'} key={'None'} primaryText={'None'}/>} />
                  <div className={'tabTitle'} style={{'marginTop': '25px'}}>Manual exceptions</div>
                  <Texture  
                    title='Remove  planning units from analysis'
                    onClick={this.startStopPuEditSession.bind(this)}
                    style={{color:puEditIconColor}}
                  />
                </div>
              </Tab>
            </Tabs>     
            <Paper className={'lowerToolbar'}>
                <RaisedButton 
                  icon={<Settings style={{height:'20px',width:'20px'}}/>} 
                  title="Run Settings"
                  onClick={this.showSettingsDialog.bind(this)} 
                  style={{ marginLeft:'12px', marginRight:'4px',padding: '0px',minWidth: '30px',width: '24px',height: '24px',position:'absolute'}}
                  overlayStyle={{lineHeight:'24px',height:'24px'}}
                  buttonStyle={{marginTop:'-7px',lineHeight:'24px',height:'24px'}} 
                />
                <div style={{position:'absolute',right:'40px'}}>
                  <RaisedButton 
                    label="Run" 
                    title="Click to run this scenario" 
                    secondary={true} 
                    className="scenariosBtn" 
                    style={{height:'24px'}}
                    onClick={this.props.runMarxan} 
                    disabled={!this.props.runnable || this.props.preprocessingFeature || this.props.running || (this.props.scenarioFeatures.length === 0)} 
                  />  
                </div>
            </Paper>
            <div className='footer'>
              <div>v1.0 Feedback: <a href='mailto:andrew.cottam@ec.europa.eu' className='email'>Andrew Cottam</a></div>
              <div>Marxan 2.4.3 - Ian Ball, Matthew Watts &amp; Hugh Possingham</div>
            </div>
          </Paper>
        </div>
          <ScenariosDialog 
            open={this.state.scenariosDialogOpen} 
            loadingScenarios={this.props.loadingScenarios}
            loadingScenario={this.props.loadingScenario}
            closeScenariosDialog={this.closeScenariosDialog.bind(this)}
            scenarios={this.props.scenarios}
            scenario={this.props.scenario}
            createNewScenario={this.props.createNewScenario}
            deleteScenario={this.props.deleteScenario}
            loadScenario={this.loadScenario.bind(this)}
            cloneScenario={this.props.cloneScenario}
            openNewCaseStudyDialog={this.props.openNewCaseStudyDialog}
            openImportWizard={this.props.openImportWizard}
          />
      </React.Fragment>
    );
  }
}

export default InfoPanel;
