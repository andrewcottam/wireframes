import React from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import * as jsonp from 'jsonp';
import InfoPanel from './InfoPanel.js';

//CONSTANTS
let ENDPOINT = "https://db-server-blishten.c9users.io/marxan/webAPI/run";
let NUMBER_OF_RUNS = 10;

mapboxgl.accessToken = 'pk.eyJ1IjoiYmxpc2h0ZW4iLCJhIjoiMEZrNzFqRSJ9.0QBRA2HxTb8YHErUFRMPZg';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = { "planning_unit": undefined };
  }

  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/blishten/cjg6jk8vg3tir2spd2eatu5fd',
      center: [0.05, 0.049],
      zoom: 12
    });
    this.map.on("load", this.mapLoaded.bind(this));
  }

  mapLoaded(map) {
    this.map.on("mousemove", this.mouseMove.bind(this));
    jsonp(ENDPOINT + "?numreps=" + NUMBER_OF_RUNS, this.parseData.bind(this)); //get the data from the server and parse it
  }

  parseData(err, response) {
    if (err) throw err;
    this.data = response.ssoln && response.ssoln;
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
  }

  mouseMove(e) {
    var features = this.map.queryRenderedFeatures(e.point);
    //get the planning unit features that are underneath the mouse
    if ((features.length) && (features[0].layer.id == "planning-units-3857-visible-a-0vmt87")) {
      //get the properties from the vector tiles
      let vector_tile_properties = features[0].properties;
      //get the properties from the marxan results
      let marxan_results = this.data ? this.data.filter(item => item.planning_unit == vector_tile_properties.PUID)[0] : {};
      //combine the 2 sets of properties
      this.planning_unit = Object.assign(vector_tile_properties, marxan_results);
      //set the state to re-render
      this.setState({'planning_unit':this.planning_unit});
    }
  }

  render() {
    return (
      <React.Fragment>
        <div ref={el => this.mapContainer = el} className="absolute top right left bottom" />
        <InfoPanel planning_unit={this.state.planning_unit}/>
      </React.Fragment>
    );
  }
}

export default App;
