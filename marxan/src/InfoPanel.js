import React from 'react';
import 'react-table/react-table.css';
import Paper from 'material-ui/Paper';
import AppBar from 'material-ui/AppBar';
import { Tabs, Tab } from 'material-ui/Tabs';
import RaisedButton from 'material-ui/RaisedButton';
import UserMenu from './UserMenu.js';
import SelectField from 'material-ui/SelectField';
import InterestFeaturesReportPanel from './InterestFeaturesReportPanel';
import MenuItem from 'material-ui/MenuItem';
import FontAwesome from 'react-fontawesome';

class InfoPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {  puEditing: false };
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
      <div style={{'position':'absolute', display: this.props.loggedIn ? 'block' : 'none'}}>
        <Paper zDepth={2} className='InfoPanelPaper'>
          <input id="scenarioName" style={{'display': (this.props.editingScenarioName) ? 'block' : 'none'}} className={'scenarioNameEditBox'} onKeyPress={this.onKeyPress.bind(this)} onBlur={this.onBlur.bind(this)}/>
          <AppBar title={this.props.scenario} showMenuIconButton={false} onClick={this.startEditingScenarioName.bind(this)}
          iconElementRight={
          <UserMenu user={ this.props.user} 
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
                    />}/>
          <Tabs contentContainerStyle={{'margin':'20px'}}>
            <Tab label="Scenario">
              <div>
                <div className={'tabTitle'}>Description</div>
                <input id="descriptionEdit" style={{'display': (this.props.editingDescription) ? 'block' : 'none'}} className={'descriptionEditBox'} onKeyPress={this.onKeyPress.bind(this)} onBlur={this.onBlur.bind(this)}/>
                <div className={'description'} onClick={this.startEditingDescription.bind(this)} style={{'display': (!this.props.editingDescription) ? 'block' : 'none'}}>{this.props.metadata.DESCRIPTION}</div>
                <div className={'tabTitle'} style={{marginTop:'10px'}}>Created</div>
                <div className={'createDate'}>{this.props.metadata.CREATEDATE}</div>
              </div>
            </Tab>
            <Tab label="Features" onActive={this.features_tab_active.bind(this)}>
              <div>
              <InterestFeaturesReportPanel
                scenarioFeatures={this.props.scenarioFeatures}
                updateTargetValue={this.props.updateTargetValue}
              />
              </div>
            </Tab>
            <Tab label="Planning units" onActive={this.pu_tab_active.bind(this)}>
              <div>
                <div className={'tabTitle'}>Planning area</div>
                <div>{this.props.metadata.pu_alias}</div>
                <div className={'tabTitle'} style={{'marginTop': '25px'}}>Protected areas</div>
                <SelectField floatingLabelText={'Include'} floatingLabelFixed={true} value={'None'} children={<MenuItem value={'None'} key={'None'} primaryText={'None'}/>} />
                <div className={'tabTitle'} style={{'marginTop': '25px'}}>Manual exceptions</div>
                <RaisedButton icon={<FontAwesome name='eraser' title='Remove  planning units from analysis' style={{color:puEditIconColor}}/>} onClick={this.startStopPuEditSession.bind(this)}/>
              </div>
            </Tab>
          </Tabs>                        
          <RaisedButton title="Run Settings" className={'settings'} onClick={this.showSettingsDialog.bind(this)} icon={<FontAwesome name='cog' title='Run Settings'/>}/>
          <RaisedButton title="Click to run this scenario" label={this.props.running ? "Running" : "Run"} secondary={true} className={'run'} onClick={this.props.runMarxan} disabled={!this.props.runnable || this.props.running}/>
          <div className='footer'>
            <div>v1.0 Feedback: <a href='mailto:andrew.cottam@ec.europa.eu' className='email'>Andrew Cottam</a></div>
            <div>Marxan 2.4.3 - Ian Ball, Matthew Watts &amp; Hugh Possingham</div>
          </div>
        </Paper>
      </div>
    );
  }
}

export default InfoPanel;
