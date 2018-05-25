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
import { BrowserRouter as Router, Route } from "react-router-dom";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { filter: 'Summary', chipData: [], selectedItems: [] };
    window.basepath = (process.env.NODE_ENV === 'production') ? "/wireframes/acp/build/" : "/wireframes/acp/";
    window.colors = ['#8D228C', '#00B172', '#2B65A5', '#FAB800', '#FF006A', '#5EC461', '#F57E00', '#00899B', '#EA008E', '#FF6A5F', '#504098', '#A2AE9A', '#8D228C', '#00B172', '#2B65A5', '#FAB800', '#FF006A', '#5EC461', '#F57E00', '#00899B', '#EA008E', '#FF6A5F', '#504098', '#A2AE9A', '#8D228C'];
    window.percentages = [35, 25, 12, 23, 4, 6, 19, 5, 25, 16, 28, 20, 12, 6, 11, 5, 32, 25, 33, 39, 13, 3, 2, 23, 2];
    window.pacific = [{ name: 'Cook Islands', iso3: 'COK' }, { name: 'Federated States of Micronesia', iso3: 'FSM' }, { name: 'Fiji', iso3: 'FJI' }, { name: 'Kiribati', iso3: 'KIR' }, { name: 'Marshall Islands', iso3: 'MHL' }, { name: 'Nauru', iso3: 'NRU' }, { name: 'Niue', iso3: 'NIU' }, { name: 'Palau', iso3: 'PLW' }, { name: 'Papua New Guinea', iso3: 'PNG' }, { name: 'Samoa', iso3: 'WSM' }, { name: 'Solomon Islands', iso3: 'SLB' }, { name: 'Timor-Leste', iso3: 'TLS' }, { name: 'Tonga', iso3: 'TON' }, { name: 'Tuvalu', iso3: 'TUV' }, { name: 'Vanuatu', iso3: 'VUT' }];
    window.caribbean = [{name:'Antigua and Barbuda',iso3:'ATG'},{name:'Bahamas',iso3:'BHS'},{name:'Barbados',iso3:'BRB'},{name:'Belize',iso3:'BLZ'},{name:'Cuba',iso3:'CUB'},{name:'Dominica',iso3:'DMA'},{name:'Dominican Republic',iso3:'DOM'},{name:'Grenada',iso3:'GRD'},{name:'Guyana',iso3:'GUY'},{name:'Haiti',iso3:'HTI'},{name:'Jamaica',iso3:'JAM'},{name:'Saint Kitts and Nevis',iso3:'KNA'},{name:'Saint Lucia',iso3:'LCA'},{name:'Saint Vincent and the Grenadines',iso3:'VCT'},{name:'Suriname',iso3:'SUR'},{name:'Trinidad and Tobago',iso3:'TTO'}];
    window.esafrica = [{name:'Botswana',iso3:'BWA'},{name:'Comoros',iso3:'COM'},{name:'Djibouti',iso3:'DJI'},{name:'Eritrea',iso3:'ERI'},{name:'Ethiopia',iso3:'ETH'},{name:'Kenya',iso3:'KEN'},{name:'Lesotho',iso3:'LSO'},{name:'Madagascar',iso3:'MDG'},{name:'Malawi',iso3:'MWI'},{name:'Mauritius',iso3:'MUS'},{name:'Mozambique',iso3:'MOZ'},{name:'Namibia',iso3:'NAM'},{name:'Rwanda',iso3:'RWA'},{name:'Seychelles',iso3:'SYC'},{name:'Somalia',iso3:'SOM'},{name:'South Africa',iso3:'ZAF'},{name:'South Sudan',iso3:'SSD'},{name:'Sudan',iso3:'SDN'},{name:'Swaziland',iso3:'SWZ'},{name:'Tanzania, United Republic of',iso3:'TZA'},{name:'Uganda',iso3:'UGA'},{name:'Zambia',iso3:'ZMB'},{name:'Zimbabwe',iso3:'ZWE'}];
    window.cwafrica = [{name:'Angola',iso3:'AGO'},{name:'Benin',iso3:'BEN'},{name:'Burkina Faso',iso3:'BFA'},{name:"Côte d'Ivoire",iso3:'CIV'},{name:'Cameroon',iso3:'CMR'},{name:'Cape Verde',iso3:'CPV'},{name:'Central African Republic',iso3:'CAF'},{name:'Chad',iso3:'TCD'},{name:'Congo',iso3:'COG'},{name:'Congo, the Democratic Republic of the',iso3:'COD'},{name:'Equatorial Guinea',iso3:'GNQ'},{name:'Gabon',iso3:'GAB'},{name:'Gambia',iso3:'GMB'},{name:'Ghana',iso3:'GHA'},{name:'Guinea',iso3:'GIN'},{name:'Guinea-Bissau',iso3:'GNB'},{name:'Liberia',iso3:'LBR'},{name:'Mali',iso3:'MLI'},{name:'Mauritania',iso3:'MRT'},{name:'Niger',iso3:'NER'},{name:'Nigeria',iso3:'NGA'},{name:'São Tomé and Príncipe',iso3:'STP'},{name:'Senegal',iso3:'SEN'},{name:'Sierra Leone',iso3:'SLE'},{name:'Togo',iso3:'TGO'}];
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
                <FilterItem title='Protected area' names={['Crater Mountain','Salonga National Park','Virunga National Park']} value={this.state.selectedItems} onChange={this.filterChange.bind(this)}></FilterItem>
                <FilterItem title='Indicator' names={['Marine protected area coverage','Terrestrial protected area coverage']} value={this.state.selectedItems} onChange={this.filterChange.bind(this)}></FilterItem>
              </div>
              <ChipArray chipData={this.state.chipData} deleteChip={this.deleteChip.bind(this)}></ChipArray>  
              <RaisedButton label="Search" secondary={true} style={{margin:'10px'}} />
            </Drawer>
            <div className="rightPane" ref="rightPane">
              <div className="rightPaneInner">
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
