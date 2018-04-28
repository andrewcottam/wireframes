import React from 'react';
import 'react-table/react-table.css';
import Paper from 'material-ui/Paper';
import AppBar from 'material-ui/AppBar';
import { Tabs, Tab } from 'material-ui/Tabs';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import ReactTable from "react-table";
import FileUpload from './FileUpload.js';
import UserMenu from './UserMenu.js';
import SpatialDataSelector from './SpatialDataSelector.js';

class InfoPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 'allFilesUploaded': true };
    this.nUploading = 0;
  }
  changeVerbosity(e, value) {
    this.props.setVerbosity(value);
  }
  loadSolution(solution) {
    this.props.loadSolution(solution);
  }
  validateUploads(validated) {
    //each time we upload a file we increment the uploading files counter - when it has finished then we decrement the counter
    validated ? this.nUploading -= 1 : this.nUploading += 1;
    (this.nUploading === 0) ? this.setState({ 'allFilesUploaded': true }): this.setState({ 'allFilesUploaded': false });
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
    this.props.spatialLayerChanged(tileset,zoomToBounds);
  }

  render() {
    return (
      <div style={{'position':'absolute'}}>
        <Paper zDepth={2} id='InfoPanel'>
          <AppBar title={this.props.scenario} showMenuIconButton={false}  style={{'opactiy': this.props.loggedIn ? 1 : 0.2}} iconElementRight={
          <UserMenu user={ this.props.user} 
                    onMouseEnter={this.showUserMenu.bind(this)} 
                    showUserMenu={this.showUserMenu.bind(this)} 
                    userMenuOpen={this.state.userMenuOpen} 
                    anchorEl={this.state.anchorEl} 
                    hideUserMenu={this.hideUserMenu.bind(this)} 
                    logout={this.logout.bind(this)}
                    listScenarios={this.props.listScenarios}
                    scenarios={this.props.scenarios}
                    />}/>
          <Tabs>
            <Tab label="Inputs" className={'tab'}>
              <div className='tabPanel'>
                <div className={'tabTitle'}>Input files</div>
                <div className={'uploadControls'}>
                  <SpatialDataSelector spatialLayerChanged={this.spatialLayerChanged.bind(this)}/>
                  <FileUpload marxanfile="spec.dat" label="Species file" fileUploaded={this.validateUploads.bind(this)} user={this.props.user} scenario={this.props.scenario}/>
                  <FileUpload marxanfile="pu.dat" label="Planning unit file" fileUploaded={this.validateUploads.bind(this)} user={this.props.user} scenario={this.props.scenario}/>
                  <FileUpload marxanfile="puvspr.dat" label="Planning unit vs species file" fileUploaded={this.validateUploads.bind(this)} user={this.props.user} scenario={this.props.scenario}/>
                  <FileUpload marxanfile="bound.dat" label="Block definitions" fileUploaded={this.validateUploads.bind(this)} user={this.props.user} scenario={this.props.scenario}/>
                  <FileUpload marxanfile="blockdef.dat" label="Boundary length file" fileUploaded={this.validateUploads.bind(this)} user={this.props.user} scenario={this.props.scenario}/>
                </div>
              </div>
            </Tab>
            <Tab label="Params" className={'tab'}>
              <div className='tabPanel'>
                <div className={'tabTitle'}>Input parameters</div>
                <table className='runParamsTable'>
                  <tbody>
                    <tr>
                      <td style={{'width':'170px','paddingRight': '12px'}}>
                          Number of solutions: 
                      </td>
                      <td>
                          <TextField id='numRuns' className='textFieldClass' value={this.props.numRuns} style={{'width':'80px'}} onChange={this.props.setNumRuns} inputStyle={{'fontSize':'13px'}}/>
                      </td>
                    </tr>
                  </tbody>
                </table>
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
          <RaisedButton label={this.props.running ? "Running" : "Run"} secondary={true} className={'run'} onClick={this.props.runMarxan} disabled={this.props.running || (this.state && this.state.allFilesUploaded === false)}/>
          <div className='footer'>v0.1 Feedback: <a href='mailto:andrew.cottam@ec.europa.eu' className='email'>Andrew Cottam</a></div>
        </Paper>
      </div>
    );
  }
}

export default InfoPanel;
