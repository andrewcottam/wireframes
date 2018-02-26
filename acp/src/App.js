import React, { Component } from 'react';
import './App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import Summary from './Summary.js';
import Region from './Region.js';
import Country from './Country.js';
import PA from './PA.js';
import Indicator from './Indicator.js';
import ChipArray from './ChipArray.js';
import FilterItem from './FilterItem.js';
import Drawer from 'material-ui/Drawer';
import RaisedButton from 'material-ui/RaisedButton';
import {BrowserRouter as Router, Route } from "react-router-dom";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { filter: 'Summary', chipData: [], selectedItems: [] };
  }
  mapLoaded(e) {
    this.setState({ map: e.target });
  }

  setSelectedItems(filterName) {
    let strings = this.chipData.map((item) => {
      return item && item.label;
    });
    if (this.chipData.length === 0) { filterName = 'Summary'; }
    this.setState({ chipData: this.chipData, selectedItems: strings, filter: filterName });

  }
  deleteChip(e) {
    this.chipData = this.state.chipData;
    const chipToDelete = this.chipData.map((chip) => chip.key).indexOf(e.key);
    this.chipData.splice(chipToDelete, 1);
    this.setSelectedItems();
  }
  filterChange(filterName, values) {
    this.chipData = this.state.chipData;
    let itemToAdd = values.map((item) => {
      let existingValues = this.state.chipData.filter(existing => existing.label === item);
      return (existingValues.length === 0) && { key: this.state.chipData.length, label: item };
    });
    this.chipData.push(itemToAdd.filter(Boolean)[0]);
    this.setSelectedItems(filterName);
  }
  onMetChartClick(metChart) {
    this.chipData = this.state.chipData;
    this.chipData.push({ key: this.chipData.length, label: metChart.props.title });
    this.setState({ activeRegion: metChart });
    this.refs.rightPane.scrollTo(0, 0);
    this.setSelectedItems(metChart.props.drillTo);
  }
  render() {
    return (
      <MuiThemeProvider>
          <div className="App">
            <AppBar title={process.env.NODE_ENV + " Biopama ACP Conservation Knowledge Centre"} showMenuIconButton={false}/>
            <Drawer open={true} containerStyle={{'position': 'absolute', 'top': '64px','overflow':'none'}} width={260}>
              <div>
                <FilterItem title='Region' names={['Caribbean','Pacific','C and W Africa','E and S Africa']} value={this.state.selectedItems} onChange={this.filterChange.bind(this)}></FilterItem>
                <FilterItem title='Country' names={['Tanzania','Uganda']} value={this.state.selectedItems} onChange={this.filterChange.bind(this)}></FilterItem>
                <FilterItem title='Protected area' names={['Salonga National Park','Virunga National Park']} value={this.state.selectedItems} onChange={this.filterChange.bind(this)}></FilterItem>
                <FilterItem title='Indicator' names={['Marine protected area coverage','Terrestrial protected area coverage']} value={this.state.selectedItems} onChange={this.filterChange.bind(this)}></FilterItem>
              </div>
              <ChipArray chipData={this.state.chipData} deleteChip={this.deleteChip.bind(this)}></ChipArray>  
              <RaisedButton label="Search" secondary={true} style={{margin:'10px'}} />
            </Drawer>
            <div className="rightPane" ref="rightPane">
              <div className="rightPaneInner">
                <Router>
                  <div>
                    <Route exact path={process.env.PUBLIC_URL} component={Summary}/>
                    <Route path={process.env.PUBLIC_URL + "Region/:region"} component={Region}/>
                    <Route path={process.env.PUBLIC_URL + "Country/:country"} component={Country}/>
                    <Route path={process.env.PUBLIC_URL + "PA/:pa"} component={PA}/>
                    <Route path={process.env.PUBLIC_URL + "Indicator/:indicator"} component={Indicator}/>
                  </div>
                </Router>
              </div>
            </div>
          </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
