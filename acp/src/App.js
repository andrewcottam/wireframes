import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import IndicatorSummary from './IndicatorSummary.js';
import PolicyItem from './PolicyItem.js';
import TargetItem from './TargetItem.js';
import Header from './Header.js';
import Header2 from './Header2.js';
import ChipArray from './ChipArray.js';
import GroupPanel from './GroupPanel.js';
import FilterItem from './FilterItem.js';
import MetChart from './MetChart.js';
import logo_g1 from './logo-g1.png';
import logo_g2 from './logo-g2.png';
import logo_r1 from './logo-r1.png';
import logo_tza from './logo-tza.png';
import Drawer from 'material-ui/Drawer';
import RaisedButton from 'material-ui/RaisedButton';

const regions = ['C and W Africa','E and S Africa','Caribbean','Pacific'];
const countries = ['American Samoa','Cook Islands','Federated States of Micronesia','Fiji','French Polynesia','Guam','Kiribati','Marshall Islands','Nauru','New Caledonia','Niue','North Mariana Islands','Palau','Papua New Guinea','Samoa','Solomon Islands','Tokelau','Tonga','Tuvalu','Vanuatu','Wallis and Futuna'];
const percentages = [35,25,52,73,24,66,99,75,85,46,28,40,42,60,11,5,42,95,53,69,33];
const colors = ['#8D228C','#00B172','#2B65A5','#FAB800','#FF006A','#5EC461','#F57E00','#00899B','#EA008E','#FF6A5F','#504098','#A2AE9A','#8D228C','#00B172','#2B65A5','#FAB800','#FF006A','#5EC461','#F57E00','#00899B','#EA008E'];
 
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
              <GroupPanel open={this.state.filter==='Summary'}>
                <Header title="ACP Summary"/>
                <Header2 title="Proportion of regional targets met"/>
                <div style={{margin:'20px'}}>
                  {regions.map((item,index)=><MetChart percentMet={percentages[index]} color={colors[index]} title={item} onClick={this.onMetChartClick.bind(this)} key={index} drillTo={'Region'}/>)}
               </div>
              </GroupPanel>
              <GroupPanel open={this.state.filter==='Region'}>
                <Header title="Region Summary"/>
                <Header2 title="Proportion of regional targets met"/>
                <div style={{margin:'20px'}}>
                  {this.state.activeRegion ? <MetChart {...this.state.activeRegion.props} clickable={false}/> : null}
                </div>
                <Header2 title="Regional targets"/>
                <PolicyItem primaryText="Framework for Nature Conservation and Protected Areas in the Pacfic Islands Region" secondaryText="2014-2020" avatar={logo_r1}/>
                <div style={{paddingLeft:'57px'}}>
                  <TargetItem primaryText="Target 11: By 2020, at least 17 per cent of terrestrial and inland water areas and 10 per cent of coastal and marine areas, especially areas of particular importance for biodiversity and ecosystem services, are conserved through effectively and equitably managed, ecologically representative and well-connected systems of protected areas and other effective area-based conservation measures, and integrated into the wider landscape and seascape."/>
                  <IndicatorSummary title="Terrestrial protected area coverage" data={[5, 10, 11, 12,12,13,16, 17, 17, 19, 22,21]} line={"mean"}/>
                  <IndicatorSummary title="Marine protected area coverage" data={[5, 5, 5, 4,8,8,9, 10, 11, 12, 12,11]} line={"mean"}/>
                </div>
                <Header2 title="Proportion of National targets met"/>
                <div style={{margin:'20px'}}>
                  {countries.map((item,index)=><MetChart percentMet={percentages[index]} color={colors[index]} title={item} onClick={this.onMetChartClick.bind(this)} key={index} drillTo={'Country'}/>)}
                </div>
              </GroupPanel>
              <GroupPanel open={this.state.filter==='Country'}>
                <Header title="Country Summary"/>
                <PolicyItem primaryText="Convention on Biological Diversity" avatar={logo_g1} secondaryText="Strategic Plan for Biodiversity 2011-2020"/>
                <div style={{paddingLeft:'57px'}}>
                  <TargetItem primaryText="Target 11: By 2020, at least 17 per cent of terrestrial and inland water areas and 10 per cent of coastal and marine areas, especially areas of particular importance for biodiversity and ecosystem services, are conserved through effectively and equitably managed, ecologically representative and well-connected systems of protected areas and other effective area-based conservation measures, and integrated into the wider landscape and seascape."/>
                  <IndicatorSummary title="Terrestrial protected area coverage" data={[5, 10, 11, 12,12,13,16, 17, 17, 19, 22,21]} line={"mean"}/>
                  <IndicatorSummary title="Marine protected area coverage" data={[5, 5, 5, 4,8,8,9, 10, 11, 12, 12,11]} line={"mean"}/>
                </div>
                <PolicyItem primaryText="Sustainable Development Goals" avatar={logo_g2} secondaryText="17 goals to transform our world and make it groovy"/>
                <div style={{paddingLeft:'57px'}}>
                  <TargetItem primaryText="Target 15: Sustainably manage forests, combat desertification, halt and reverse land degradation, halt biodiversity loss"/>
                  <IndicatorSummary title="Number of provinces that have ceased logging intact forest"  data={[7,7,8,9,9,8,7,10,9,11]}/>
                  <IndicatorSummary title="Species extinctions"  data={[0,0,1,0,0,0,0,1,0,0,2,0,0]}/>
                </div>
                <PolicyItem primaryText="Tanzania National Biodiversity Strategy and Action Plan" avatar={logo_tza} secondaryText="National NBSAP"/>
                <div style={{paddingLeft:'57px'}}>
                  <TargetItem primaryText="Target 10: By 2020, the multiple anthropogenic pressure on coral reef, and vulnerable ecosystems impacted by climatic change are minimized."/>
                  <IndicatorSummary title="Incidence of dynamite fishing"  data={[19,15,12,12,11,13,10,9,5,5,5,4]}/>
                  <IndicatorSummary title="Coral area removed for constuction"  data={[40,10,3,3,3,2,1,3]}/>
                  <IndicatorSummary title="Total area of coral bleached per annum" data={[]}/>
                  <IndicatorSummary title="Coral area removed for constuction" data={[40,10,3,3,3,2,1,3]}/>
                </div>
              </GroupPanel>
              <GroupPanel open={this.state.filter==='Protected area'}>
                <Header title="Protected Area Summary"/>
              </GroupPanel>
              <GroupPanel open={this.state.filter==='Indicator'}>
                <Header title="Indicator Summary"/>
              </GroupPanel>
            </div>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
