import React, { Component } from 'react';
import './App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import mapboxgl from 'mapbox-gl';
import IndicatorSummary from './IndicatorSummary.js';
import PolicyItem from './PolicyItem.js';
import TargetItem from './TargetItem.js';
import ChipArray from './ChipArray.js';
import GroupPanel from './GroupPanel.js';
import FilterItem from './FilterItem.js';
import logo_g1 from './logo-g1.png';
import logo_g2 from './logo-g2.png';
import logo_tza from './logo-tza.png';
import Divider from 'material-ui/Divider';
import Drawer from 'material-ui/Drawer';
import RaisedButton from 'material-ui/RaisedButton';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { filter: 'country', chipData: [{ key: 0, label: 'Tanzania' }], selectedItems: ['Tanzania'] };
  }
  mapLoaded(e) {
    this.setState({ map: e.target });
  }

  setSelectedItems(){
    let strings = this.chipData.map((item) => item.label);
    this.setState({ chipData: this.chipData, selectedItems: strings });
    
  }
  deleteChip(e) {
    this.chipData = this.state.chipData;
    const chipToDelete = this.chipData.map((chip) => chip.key).indexOf(e.key);
    this.chipData.splice(chipToDelete, 1);
    this.setSelectedItems();
  }
  filterChange(event, index, values) {
    this.chipData = this.state.chipData;
    let itemToAdd = values.map((item) => {
      let existingValues = this.state.chipData.filter(existing => existing.label == item);
      return (existingValues.length === 0) && { key: this.state.chipData.length, label: item };
    });
    this.chipData.push(itemToAdd.filter(Boolean)[0]);
    this.setSelectedItems();
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
          <div style={{marginLeft: '270px'}}>
            <GroupPanel open={this.state.filter=='country'}>
              <PolicyItem primaryText="Convention on Biological Diversity" avatar={logo_g1} secondaryText="Strategic Plan for Biodiversity 2011-2020"/>
              <Divider/>
              <div style={{paddingLeft:'57px'}}>
                <TargetItem primaryText="Target 11: By 2020, at least 17 per cent of terrestrial and inland water areas and 10 per cent of coastal and marine areas, especially areas of particular importance for biodiversity and ecosystem services, are conserved through effectively and equitably managed, ecologically representative and well-connected systems of protected areas and other effective area-based conservation measures, and integrated into the wider landscape and seascape."/>
                <IndicatorSummary title="Terrestrial protected area coverage" data={[5, 10, 11, 12,12,13,16, 17, 17, 19, 22,21]} line={"mean"}/>
                <IndicatorSummary title="Marine protected area coverage" data={[5, 5, 5, 4,8,8,9, 10, 11, 12, 12,11]} line={"mean"}/>
              </div>
              <PolicyItem primaryText="Sustainable Development Goals" avatar={logo_g2} secondaryText="17 goals to transform our world and make it groovy"/>
              <Divider/>
              <div style={{paddingLeft:'57px'}}>
                <TargetItem primaryText="Target 15: Sustainably manage forests, combat desertification, halt and reverse land degradation, halt biodiversity loss"/>
                <IndicatorSummary title="Number of provinces that have ceased logging intact forest"  data={[7,7,8,9,9,8,7,10,9,11]}/>
                <IndicatorSummary title="Species extinctions"  data={[0,0,1,0,0,0,0,1,0,0,2,0,0]}/>
              </div>
              <PolicyItem primaryText="Tanzania National Biodiversity Strategy and Action Plan" avatar={logo_tza} secondaryText="National NBSAP"/>
              <Divider/>
              <div style={{paddingLeft:'57px'}}>
                <TargetItem primaryText="Target 10: By 2020, the multiple anthropogenic pressure on coral reef, and vulnerable ecosystems impacted by climatic change are minimized."/>
                <IndicatorSummary title="Incidence of dynamite fishing"  data={[19,15,12,12,11,13,10,9,5,5,5,4]}/>
                <IndicatorSummary title="Coral area removed for constuction"  data={[40,10,3,3,3,2,1,3]}/>
                <IndicatorSummary title="Total area of coral bleached per annum" data={[]}/>
                <IndicatorSummary title="Coral area removed for constuction" data={[40,10,3,3,3,2,1,3]}/>
              </div>
            </GroupPanel>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

class Map extends React.Component {
  componentDidMount() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiYmxpc2h0ZW4iLCJhIjoiMEZrNzFqRSJ9.0QBRA2HxTb8YHErUFRMPZg'; //this is my access token
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      center: [21, -2], //salonga
      zoom: 3,
      style: 'mapbox://styles/blishten/cj6f4n2j026qf2rnunkauikjm'
    });
    this.map.on("load", (e) => this.props.onLoad(e));
  }

  componentWillUnmount() {
    this.map.remove();
  }

  render() {
    const style = {
      position: 'absolute',
      top: 0,
      bottom: 0,
      width: '100%'
    };
    return <div style={style} ref={el => this.mapContainer = el} />;
  }
}

export default App;
