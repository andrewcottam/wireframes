import React from 'react';
import 'react-table/react-table.css';
import Paper from 'material-ui/Paper';
import AppBar from 'material-ui/AppBar';
import { Tabs, Tab } from 'material-ui/Tabs';
import RaisedButton from 'material-ui/RaisedButton';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import ReactTable from "react-table";
import FileUpload from './FileUpload.js';
import UserMenu from './UserMenu.js';
import SpatialDataSelector from './SpatialDataSelector.js';
import ParametersTable from './ParametersTable.js';

class InfoPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 'allFilesUploaded': true, editingScenarioName: false };
    this.nUploading = 0;
  }
  componentDidUpdate(prevProps, prevState) {
    //if the input box for renaming the scenario has been made visible and it has no value, then initialise it with the scenario name and focus it
    if (prevProps.editingScenarioName === false && this.props.editingScenarioName) {
      document.getElementById("scenarioName").value = this.props.scenario;
      document.getElementById("scenarioName").focus();
    }
  }
  changeVerbosity(e, value) {
    this.props.setVerbosity(value);
  }
  loadSolution(solution) {
    this.props.loadSolution(solution);
  }
  validateUploads(validated, parameter, filename) {
    //each time we upload a file we increment the uploading files counter - when it has finished then we decrement the counter
    validated ? this.nUploading -= 1 : this.nUploading += 1;
    (this.nUploading === 0) ? this.setState({ 'allFilesUploaded': true }): this.setState({ 'allFilesUploaded': false });
    if (validated) this.props.fileUploaded(parameter, filename);
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

  spatialLayerChanged(tileset, zoomToBounds) {
    this.props.spatialLayerChanged(tileset, zoomToBounds);
  }

  onKeyPress(e) {
    if (e.nativeEvent.keyCode === 13) {
      document.getElementById("scenarioName").blur(); //call the onBlur event which will call the REST service to rename the scenario
    }
  }

  onBlur(e) {
    this.props.renameScenario(e.target.value);
  }

  startEditingScenarioName() {
    if (this.props.scenario) { //a scenario may not be loaded
      this.props.startEditingScenarioName();
    }
  }
  render() {
    return (
      <div style={{'position':'absolute'}}>
        <Paper zDepth={2} id='InfoPanel'>
          <input id="scenarioName" style={{'display': (this.props.editingScenarioName) ? 'block' : 'none'}} className={'scenarioNameEditBox'} onKeyPress={this.onKeyPress.bind(this)} onBlur={this.onBlur.bind(this)}/>
          <AppBar title={this.props.scenario} showMenuIconButton={false}  style={{'opactiy': this.props.loggedIn ? 1 : 0.2}} onClick={this.startEditingScenarioName.bind(this)}
          iconElementRight={
          <UserMenu user={ this.props.user} 
                    onMouseEnter={this.showUserMenu.bind(this)} 
                    showUserMenu={this.showUserMenu.bind(this)} 
                    userMenuOpen={this.state.userMenuOpen} 
                    anchorEl={this.state.anchorEl} 
                    hideUserMenu={this.hideUserMenu.bind(this)} 
                    logout={this.logout.bind(this)}
                    listScenarios={this.props.listScenarios}
                    scenarios={this.props.scenarios}
                    createNewScenario={this.props.createNewScenario}
                    deleteScenario={this.props.deleteScenario}
                    loadScenario={this.props.loadScenario}
                    />}/>
          <Tabs>
            <Tab label="Inputs" className={'tab'}>
              <div className='tabPanel'>
                <div className={'tabTitle'}>Input files</div>
                <div className={'uploadControls'}>
                  <SpatialDataSelector spatialLayerChanged={this.spatialLayerChanged.bind(this)}/>
                  <FileUpload parameter="SPECNAME" mandatory={true} value={this.props.files.SPECNAME} label="Species file" fileUploaded={this.validateUploads.bind(this)} user={this.props.user} scenario={this.props.scenario}/>
                  <FileUpload parameter="PUNAME" mandatory={true} value={this.props.files.PUNAME} label="Planning unit file" fileUploaded={this.validateUploads.bind(this)} user={this.props.user} scenario={this.props.scenario}/>
                  <FileUpload parameter="PUVSPRNAME" mandatory={true} value={this.props.files.PUVSPRNAME} label="Planning unit vs species file" fileUploaded={this.validateUploads.bind(this)} user={this.props.user} scenario={this.props.scenario}/>
                  <FileUpload parameter="BOUNDNAME" value={this.props.files.BOUNDNAME} label="Boundary length file" fileUploaded={this.validateUploads.bind(this)} user={this.props.user} scenario={this.props.scenario}/>
                  <FileUpload parameter="BLOCKDEFNAME" value={this.props.files.BLOCKDEFNAME} label="Block definitions" fileUploaded={this.validateUploads.bind(this)} user={this.props.user} scenario={this.props.scenario}/>
                </div>
              </div>
            </Tab>
            <Tab label="Params" className={'tab'}>
              <div className='tabPanel'>
                <div className={'tabTitle'}>Input parameters</div>
                  <ParametersTable runParams={this.props.runParams}/>
              </div>
            </Tab>
            <Tab
              label="Log"
              data-route="/home" className={'tab'}
            >
              <div className='tabPanel'>
                <div className={'tabTitle'}>Processing Log</div>
                <RadioButtonGroup name="logOptions" defaultSelected="2" style={{ display: 'flex',margin:'17px 0px 5px 9px' }} onChange={this.changeVerbosity.bind(this)}>
                  <RadioButton
                    value="0"
                    label="Silent"
                    iconStyle={{marginRight:'3px',width: 18, height: 18,'marginTop': '1px'}}
                    labelStyle={{'fontSize':'13px'}}
                  />
                  <RadioButton
                    value="1"
                    label="Results"
                    iconStyle={{marginRight:'3px',width: 18, height: 18,'marginTop': '1px'}}
                    labelStyle={{'fontSize':'13px'}}
                  />
                  <RadioButton
                    value="2"
                    label="General"
                    iconStyle={{marginRight:'3px',width: 18, height: 18,'marginTop': '1px'}}
                    labelStyle={{'fontSize':'13px'}}
                  />
                  <RadioButton
                    value="3"
                    label="Detailed"
                    iconStyle={{marginRight:'3px',width: 18, height: 18,'marginTop': '1px'}}
                    labelStyle={{'fontSize':'13px'}}
                  />
                </RadioButtonGroup>
                <div id="log" dangerouslySetInnerHTML={{__html:this.props.log}}></div>
              </div>
            </Tab>
            <Tab
              label="Outputs"
              data-route="/home" className={'tab'}
            >
              <div className='tabPanel'>
                <div className="tabTitle">Solutions</div>
                <div id="solutionsPanel" style={{'display': (this.props.dataAvailable && !this.props.running ? 'block' : 'none')}}>
                  <ReactTable
                    infoPanel={this}
                    getTrProps={(state, rowInfo, column, instance) => {
                        return {
                          onClick: (e, handleOriginal) => {
                            if (instance.lastSelectedRow) instance.lastSelectedRow.style['background-color'] = '';
                            instance.lastSelectedRow = e.currentTarget;
                            e.currentTarget.style['background-color'] = 'lightgray';
                            instance.props.infoPanel.loadSolution(rowInfo.original.Run_Number);
                          },
                          title: 'Click to show on the map'
                        };
                      }}
                    className={'summary_infoTable -highlight'}
                    showPagination={false}
                    minRows={0}
                    pageSize={200}
                    noDataText=''
                    data={this.props.solutions}
                    columns={[{
                       Header: 'Run', 
                       accessor: 'Run_Number',
                       width:44,
                       headerStyle:{'textAlign':'left'}                             
                    },{
                       Header: 'Score',
                       accessor: 'Score',
                       width:90,
                      headerStyle:{'textAlign':'left'}
                    },{
                       Header: 'Cost',
                       accessor: 'Cost' ,
                       width:47,
                       headerStyle:{'textAlign':'left'}
                    },{
                       Header: 'Planning Units',
                       accessor: 'Planning_Units' ,
                       width:130,
                       headerStyle:{'textAlign':'left'}
                    }]}
                  />
                </div>
                <div style={{'paddingBottom':'8px','margin':'17px 0px 0px 10px','fontSize':'13px'}}>{this.props.outputsTabString}</div>
              </div>
            </Tab>
          </Tabs>                        
          <RaisedButton label={this.props.running ? "Running" : "Run"} secondary={true} className={'run'} onClick={this.props.runMarxan} disabled={!this.props.runnable || this.props.running || (this.state && this.state.allFilesUploaded === false)}/>
          <div className='footer'>v0.1 Feedback: <a href='mailto:andrew.cottam@ec.europa.eu' className='email'>Andrew Cottam</a></div>
        </Paper>
      </div>
    );
  }
}

export default InfoPanel;
