import React from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import * as jsonp from 'jsonp';
import InfoPanel from './InfoPanel.js';
import Popup from './Popup.js';
import Loading from './loading.gif';

//CONSTANTS
let ENDPOINT = "https://db-server-blishten.c9users.io/marxan/webAPI/run";
let NUMBER_OF_RUNS = 10;

mapboxgl.accessToken = 'pk.eyJ1IjoiYmxpc2h0ZW4iLCJhIjoiMEZrNzFqRSJ9.0QBRA2HxTb8YHErUFRMPZg';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = { running: false, planning_unit: undefined, log: 'No data', dataAvailable: false, results: 'No data', popup_point: { x: 0, y: 0 } };
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
  }

  runMarxan() {
    this.setState({ running: true, log: 'Running...', planning_unit: undefined, results: 'Running...' });
    jsonp(ENDPOINT + "?numreps=" + NUMBER_OF_RUNS, this.parseData.bind(this)); //get the data from the server and parse it
  }

  parseData(err, response) {
    if (err) throw err;
    this.data = response.ssoln && response.ssoln;
    if (this.data) {
      this.setState({ dataAvailable: true });
    }
    else {
      this.setState({ dataAvailable: false });
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
    this.setState({ running: false, log: response.log.replace(/(\r\n|\n|\r)/g, "<br />"), results: 'Hover over the features to show the data' });
  }

  mouseMove(e) {
    var features = this.map.queryRenderedFeatures(e.point);
    //get the planning unit features that are underneath the mouse
    if ((features.length) && (features[0].layer.id == "planning-units-3857-visible-a-0vmt87")) {
      //set the location for the popup
      if (!this.state.planning_unit || (this.state.planning_unit && this.state.planning_unit.PUID !== features[0].properties.PUID)) this.setState({ popup_point: e.point });
      //get the properties from the vector tiles
      let vector_tile_properties = features[0].properties;
      //get the properties from the marxan results
      let marxan_results = this.data ? this.data.filter(item => item.planning_unit == vector_tile_properties.PUID)[0] : {};
      //combine the 2 sets of properties
      this.planning_unit = Object.assign(marxan_results, vector_tile_properties);
      //set the state to re-render
      this.setState({ planning_unit: this.planning_unit });
    }
    else {
      this.setState({ planning_unit: undefined });
    }
  }

  render() {
    return (
      <React.Fragment>
        <div ref={el => this.mapContainer = el} className="absolute top right left bottom" />
        <InfoPanel planning_unit={this.state.planning_unit} runMarxan={this.runMarxan.bind(this)} running={this.state.running} results={this.state.results} log={this.state.log} dataAvailable={this.state.dataAvailable}/>
        <img src={Loading} id='loading' style={{'display': (this.state.running ? 'block' : 'none')}}/>
        <Popup planning_unit={this.state.planning_unit} xy={this.state.popup_point}/>
      </React.Fragment>
    );
  }
}

export default App;
