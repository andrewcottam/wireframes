import React from 'react';
import 'react-table/react-table.css';
import Paper from 'material-ui/Paper';
import AppBar from 'material-ui/AppBar';
import { Tabs, Tab } from 'material-ui/Tabs';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import FontAwesome from 'react-fontawesome';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import ReactTable from "react-table";
import FileUpload from './FileUpload.js';

class InfoPanel extends React.Component {
  changeVerbosity(e, value) {
    this.props.setVerbosity(value);
  }
  loadSolution(solution) {
    this.props.loadSolution(solution);
  }
  render() {
    return (
      <div style={{'position':'absolute'}}>
        <Paper zDepth={2} id='InfoPanel'>
          <AppBar  title="Marxan Demonstration" showMenuIconButton={false}/>
          <Tabs>
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
            <Tab label="Inputs" className={'tab'}>
              <div className='tabPanel'>
                <div className={'tabTitle'}>Input files</div>
                <div className={'uploadControls'}>
                  <label htmlFor='myInput'>
                    <input id="myInput" type="file" style={{visibility: 'hidden',display:'none'}} />
                    <div><FontAwesome name='upload' color='red' className='uploadImg'/>Species file</div>
                    <div><FontAwesome name='upload' color='red' className='uploadImg'/>Planning unit file</div>
                    <div><FontAwesome name='upload' color='red' className='uploadImg'/>Planning unit versus species file</div>
                    <div><FontAwesome name='upload' color='red' className='uploadImg'/>Block definitions (optional)</div>
                    <div><FontAwesome name='upload' color='red' className='uploadImg'/>Boundary length file (optional)</div>
                  </label>
                </div>
                <FileUpload/>
                <div style={{'fontSize': '13px','margin':'10px 0px 0px 10px'}}>(Not currently implemented)</div>
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
          <RaisedButton label={this.props.running ? "Running" : "Run"} secondary={true} className={'run'} onClick={this.props.runMarxan} disabled={this.props.running}/>
          <div className='footer'>v0.1 Feedback: <a href='mailto:andrew.cottam@ec.europa.eu' className='email'>Andrew Cottam</a></div>
        </Paper>
      </div>
    );
  }
}

export default InfoPanel;
