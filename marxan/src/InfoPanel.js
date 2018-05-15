import React from 'react';
import 'react-table/react-table.css';
import Paper from 'material-ui/Paper';
import AppBar from 'material-ui/AppBar';
import { Tabs, Tab } from 'material-ui/Tabs';
import RaisedButton from 'material-ui/RaisedButton';
import ReactTable from "react-table";
import FileUpload from './FileUpload.js';
import UserMenu from './UserMenu.js';
import SpatialDataSelector from './SpatialDataSelector.js';
import LogDialog from './LogDialog.js';
import ParametersDialog from './ParametersDialog.js';
import ClassificationDialog from './ClassificationDialog.js';

class InfoPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 'allFilesUploaded': true, editingScenarioName: false, logDialogOpen: false, classificationDialogOpen: false };
    this.nUploading = 0;
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    //if the input box for renaming the scenario has been made visible and it has no value, then initialise it with the scenario name and focus it
    if (prevProps.editingScenarioName === false && this.props.editingScenarioName) {
      document.getElementById("scenarioName").value = this.props.scenario;
      document.getElementById("scenarioName").focus();
    }
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
    if (e.nativeEvent.keyCode === 13 || e.nativeEvent.keyCode === 27) {
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

  openLogDialog() {
    this.setState({ logDialogOpen: true });
  }
  closeLogDialog() {
    this.setState({ logDialogOpen: false });
  }

  openParametersDialog() {
    this.props.openParametersDialog();
  }
  closeParametersDialog() {
    this.props.closeParametersDialog();
  }

  openClassificationDialog() {
    this.setState({ classificationDialogOpen: true });
  }
  closeClassificationDialog() {
    this.setState({ classificationDialogOpen: false });
  }

  render() {
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
                    createNewScenario={this.props.createNewScenario}
                    deleteScenario={this.props.deleteScenario}
                    loadScenario={this.props.loadScenario}
                    saveOptions={this.props.saveOptions}
                    savingOptions={this.props.savingOptions}
                    openOptionsDialog={this.props.openOptionsDialog}
                    closeOptionsDialog={this.props.closeOptionsDialog}
                    optionsDialogOpen={this.props.optionsDialogOpen}
                    hidePopup={this.props.hidePopup}
                    updateUser={this.props.updateUser}
                    />}/>
          <Tabs tabTemplateStyle={{paddingLeft:'10px'}}>
            <Tab label="Scenario" className={'tab'}>
              <div className='tabPanel'>
                <div className={'tabTitle'}>Description</div>
                <div>{this.props.metadata.DESCRIPTION}</div>
                <div className={'tabTitle'}>Created</div>
                <div>{this.props.metadata.CREATEDATE}</div>
              </div>
            </Tab>
            <Tab label="Inputs" className={'tab'}>
              <div className='tabPanel'>
                <div className={'tabTitle'}>Planning area</div>
                <SpatialDataSelector spatialLayerChanged={this.spatialLayerChanged.bind(this)} tilesets={this.props.tilesets} changeTileset={this.props.changeTileset} value={this.props.tilesetid}/>
                <div className={'tabTitle'}>Input files</div>
                <div className={'uploadControls'}>
                  <FileUpload parameter="SPECNAME" mandatory={true} value={this.props.files.SPECNAME} label="Species file" fileUploaded={this.validateUploads.bind(this)} user={this.props.user} scenario={this.props.scenario}/>
                  <FileUpload parameter="PUNAME" mandatory={true} value={this.props.files.PUNAME} label="Planning unit file" fileUploaded={this.validateUploads.bind(this)} user={this.props.user} scenario={this.props.scenario}/>
                  <FileUpload parameter="PUVSPRNAME" mandatory={true} value={this.props.files.PUVSPRNAME} label="Planning unit vs species file" fileUploaded={this.validateUploads.bind(this)} user={this.props.user} scenario={this.props.scenario}/>
                  <FileUpload parameter="BOUNDNAME" value={this.props.files.BOUNDNAME} label="Boundary length file" fileUploaded={this.validateUploads.bind(this)} user={this.props.user} scenario={this.props.scenario}/>
                  <FileUpload parameter="BLOCKDEFNAME" value={this.props.files.BLOCKDEFNAME} label="Block definitions" fileUploaded={this.validateUploads.bind(this)} user={this.props.user} scenario={this.props.scenario}/>
                </div>
              </div>
              <RaisedButton
                title="Click to change the run parameters"
                label={'Run parameters'} 
                onClick={this.openParametersDialog.bind(this)} 
                className={'logButton'}
              />
              <ParametersDialog
                open={this.props.parametersDialogOpen}
                closeParametersDialog={this.closeParametersDialog.bind(this)}
                runParams={this.props.runParams}
                updateRunParams={this.props.updateRunParams}
                updatingRunParameters={this.props.updatingRunParameters}
              />
            </Tab>
            <Tab label="Outputs" className={'tab'}>
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
              <RaisedButton 
                title="Click to view the Marxan log"
                label={'Log'} 
                onClick={this.openLogDialog.bind(this)} 
                className={'logButton'}
                disabled={!this.props.dataAvailable}/>
              <LogDialog 
                log={this.props.log} 
                open={this.state.logDialogOpen}
                closeLogDialog={this.closeLogDialog.bind(this)}/>
            </Tab>
            <Tab label="Map" className={'tab'}>
              <div className='tabPanel'>
                <div className={'tabTitle'}>Map</div>
              <RaisedButton 
                title="Click to view the classifcation"
                label={'Custom'} 
                onClick={this.openClassificationDialog.bind(this)} 
                className={'logButton'}
                disabled={!this.props.dataAvailable}/>
                </div>
              <ClassificationDialog 
                open={this.state.classificationDialogOpen}
                renderer={this.props.renderer}
                closeClassificationDialog={this.closeClassificationDialog.bind(this)}
                changeColorCode={this.props.changeColorCode.bind(this)}
                changeRenderer={this.props.changeRenderer.bind(this)}
                changeNumClasses={this.props.changeNumClasses.bind(this)}
                changeShowTopClasses={this.props.changeShowTopClasses.bind(this)}
                summaryStats={this.props.summaryStats}
                dataBreaks={this.props.dataBreaks}
                />
            </Tab>
          </Tabs>                        
          <RaisedButton title="Click to run this scenario" label={this.props.running ? "Running" : "Run"} secondary={true} className={'run'} onClick={this.props.runMarxan} disabled={!this.props.runnable || this.props.running || (this.state && this.state.allFilesUploaded === false)}/>
          <div className='footer'>
            <div>v0.2 Feedback: <a href='mailto:andrew.cottam@ec.europa.eu' className='email'>Andrew Cottam</a></div>
            <div>Marxan 2.4.3 - Ian Ball, Matthew Watts &amp; Hugh Possingham</div>
          </div>
        </Paper>
      </div>
    );
  }
}

export default InfoPanel;
