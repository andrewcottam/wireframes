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
    window.basepath = (process.env.NODE_ENV==='production') ? "/wireframes/acp/build/" : "/wireframes/acp/";
    window.colors = ['#8D228C', '#00B172', '#2B65A5', '#FAB800', '#FF006A', '#5EC461', '#F57E00', '#00899B', '#EA008E', '#FF6A5F', '#504098', '#A2AE9A', '#8D228C', '#00B172', '#2B65A5', '#FAB800', '#FF006A', '#5EC461', '#F57E00', '#00899B', '#EA008E', '#FF6A5F', '#504098', '#A2AE9A', '#8D228C'];
    window.percentages = [35, 25, 12, 23, 4, 6, 19, 5, 25, 16, 28, 20, 12, 6, 11, 5, 32, 25, 33, 39, 13,3,2,23,2];
    window.pacific = ['Cook Islands', 'Federated States of Micronesia', 'Fiji', 'Kiribati', 'Marshall Islands', 'Nauru', 'Niue', 'Palau', 'Papua New Guinea', 'Samoa', 'Solomon Islands', 'Timor-Leste', 'Tonga', 'Tuvalu', 'Vanuatu'];
    window.caribbean = ["Antigua and Barbuda", "Bahamas", "Barbados", "Belize", "Cuba", "Dominica", "Dominican Republic", "Grenada", "Guyana", "Haiti", "Jamaica", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Suriname", "Trinidad and Tobago"];
    window.esafrica = ["Botswana", "Comoros", "Djibouti", "Eritrea", "Ethiopia", "Kenya", "Lesotho", "Madagascar", "Malawi", "Mauritius", "Mozambique", "Namibia", "Rwanda", "Seychelles", "Somalia", "South Africa", "South Sudan", "Sudan", "Swaziland", "Tanzania, United Republic of", "Uganda", "Zambia", "Zimbabwe"];
    window.cwafrica = ["Angola", "Benin", "Burkina Faso", "Côte d'Ivoire", "Cameroon", "Cape Verde", "Central African Republic", "Chad", "Congo", "Congo, the Democratic Republic of the", "Equatorial Guinea", "Gabon", "Gambia", "Ghana", "Guinea", "Guinea-Bissau", "Liberia", "Mali", "Mauritania", "Niger", "Nigeria", "São Tomé and Príncipe", "Senegal", "Sierra Leone", "Togo"];
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
            <AppBar title="Biopama ACP Conservation Knowledge Centre" showMenuIconButton={false}/>
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
                <div>Matched route: {window.basepath}</div>
                <Router>
                  <div>
                    <Route exact path={window.basepath} component={Summary}/>
                    <Route path={window.basepath + "Region/:region"} component={Region}/>
                    <Route path={window.basepath + "Country/:country"} component={Country}/>
                    <Route path={window.basepath + "PA/:pa"} component={PA}/>
                    <Route path={window.basepath + "Indicator/:indicator"} component={Indicator}/>
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
