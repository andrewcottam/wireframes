import React from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import * as jsonp from 'jsonp';
import InfoPanel from './InfoPanel.js';
import Loading from './loading.gif';
import ReactTable from "react-table";

//CONSTANTS
let ENDPOINT = "https://db-server-blishten.c9users.io/marxan/webAPI/run";
let NUMBER_OF_RUNS = 10;

mapboxgl.accessToken = 'pk.eyJ1IjoiYmxpc2h0ZW4iLCJhIjoiMEZrNzFqRSJ9.0QBRA2HxTb8YHErUFRMPZg';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = { 'running': false, "planning_unit": undefined ,'log':'No data','dataAvailable': false,'results':'No data'};
  }

  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/blishten/cjg6jk8vg3tir2spd2eatu5fd',
      center: [0.043476868184143314, 0.0460817578557311],
      zoom: 12
    });
    this.map.on("load", this.mapLoaded.bind(this));
  }

  mapLoaded(e) {
    this.map.addControl(new mapboxgl.FullscreenControl(), 'bottom-right');
    this.map.addControl(new mapboxgl.ScaleControl());
    this.map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
    this.map.on("mousemove", this.mouseMove.bind(this));
    this.map.on("click", this.runMarxan.bind(this));
  }

  runMarxan() {
    this.setState({ 'running': true,'log':'Running...','planning_unit': undefined, 'results':'Running...'});
    jsonp(ENDPOINT + "?numreps=" + NUMBER_OF_RUNS, this.parseData.bind(this)); //get the data from the server and parse it
  }

  parseData(err, response) {
    if (err) throw err;
    this.data = response.ssoln && response.ssoln;
    if (this.data){
      this.setState({'dataAvailable': true});
    }else{
      this.setState({'dataAvailable': false});
    }
    // Calculate color for each planning unit based on the total number of selections in the marxan runs
    var expression = ["match", ["get", "PUID"]];
    this.data.forEach(function(row) {
      var green = (row["number"] / NUMBER_OF_RUNS) * 255;
      var color = "rgba(" + 0 + ", " + green + ", " + 0 + ", 1)";
      expression.push(row["planning_unit"], color);
    });
    // Last value is the default, used where there is no data
    expression.push("rgba(0,0,0,0)");
    this.map.setPaintProperty("planning-units-3857-visible-a-0vmt87", "fill-color", expression);
    this.setState({ 'running': false, 'log': response.log.replace(/(\r\n|\n|\r)/g,"<br />") ,'results':'Hover over the features to show the data'});
  }

  showPopup(e) {
    this.removePopup();
    this.popup = new mapboxgl.Popup({ offset: [0, -20] })
      .setLngLat(e.lngLat)
      .setHTML('<InfoPanel/>')
      .addTo(this.map);
  }

  removePopup(e) {
    if (this.popup) this.popup.remove();
  }

  mouseMove(e) {
    var features = this.map.queryRenderedFeatures(e.point);
    //get the planning unit features that are underneath the mouse
    if ((features.length) && (features[0].layer.id == "planning-units-3857-visible-a-0vmt87")) {
      // this.showPopup(e);
      //get the properties from the vector tiles
      let vector_tile_properties = features[0].properties;
      //get the properties from the marxan results
      let marxan_results = this.data ? this.data.filter(item => item.planning_unit == vector_tile_properties.PUID)[0] : {};
      //combine the 2 sets of properties
      this.planning_unit = Object.assign( marxan_results,vector_tile_properties);
      //set the state to re-render
      this.setState({ 'planning_unit': this.planning_unit });
    }
    else {
      // this.removePopup();
      // this.setState({ 'planning_unit': undefined });
    }
  }

  render() {
    let data = this.state.planning_unit ? Object.keys(this.state.planning_unit).map(key => ({ key, value: this.state.planning_unit[key] })) : [];
    return (
      <React.Fragment>
        <div ref={el => this.mapContainer = el} className="absolute top right left bottom" />
        <InfoPanel planning_unit={this.state.planning_unit} runMarxan={this.runMarxan.bind(this)} running={this.state.running} results={this.state.results} log={this.state.log} dataAvailable={this.state.dataAvailable}/>
        <img src={Loading} id='loading' style={{'display': (this.state.running ? 'block' : 'none')}}/>
        <div style={{'display': data.length>0 ? 'block' : 'none'}}>
          <ReactTable
              showPagination={false}
              minRows={0}
              pageSize={200}
              noDataText=''
              data={data}
              columns={[{
                 Header: 'Property',
                 accessor: 'key' 
              },{
                 Header: 'Value',
                 accessor: 'value' 
              }]}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default App;
