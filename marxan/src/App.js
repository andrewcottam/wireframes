import React, { Component } from 'react';
import './App.css';
import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl";
import * as jsonp from 'jsonp';

let ENDPOINT = "https://db-server-blishten.c9users.io/marxan/webAPI/run";
let NUMBER_OF_RUNS = 10;
var planning_units;

const Map = ReactMapboxGl({
  accessToken: "pk.eyJ1IjoiYmxpc2h0ZW4iLCJhIjoiMEZrNzFqRSJ9.0QBRA2HxTb8YHErUFRMPZg"
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { "number": 0 };
  }
  parseData(err, response) {
    if (err) throw err;
    let data = response.ssoln && response.ssoln;
    // Calculate color for each planning unit based on the total number of selections in the marxan runs
    var expression = ["match", ["get", "PUID"]];
    data.forEach(function(row) {
      var green = (row["number"] / NUMBER_OF_RUNS) * 255;
      var color = "rgba(" + 0 + ", " + green + ", " + 0 + ", 1)";
      expression.push(row["planning_unit"], color);
    });
    // Last value is the default, used where there is no data
    expression.push("rgba(0,0,0,0)");
    this._map.setPaintProperty("planning-units-3857-visible-a-0vmt87", "fill-color", expression);
  }
  mouseMove(e) {
    var features = this._map.queryRenderedFeatures(e.point);
    if ((features.length) && (features[0].layer.id == "planning-units-3857-visible-a-0vmt87")) {
      this.setState({ "number": features[0].properties["COST"] });
    }
  }
  mapLoaded(map) {
    this._map = map;
    map.on("mousemove", this.mouseMove.bind(this));
    jsonp(ENDPOINT + "?numreps=" + NUMBER_OF_RUNS, this.parseData.bind(this)); //get the data from the server and parse it
  }
  render() {
    return (
      <div>
          <Map
            style="mapbox://styles/blishten/cjg6jk8vg3tir2spd2eatu5fd"
            center={[0.05,0.049]}
            zoom={[12]}
            onStyleLoad={this.mapLoaded.bind(this)}
            containerStyle={{
              height: "90vh",
              width: "100vw"
            }}>
          </Map>
          <div>
            <h3>{"Cost:" + this.state.number}</h3>
          </div>
      </div>
    );
  }
}

export default App;
