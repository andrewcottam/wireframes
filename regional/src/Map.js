import * as React from 'react';
import ReactMapboxGl from "react-mapbox-gl";
import MapPopup from './MapPopup.js';
// import INITIAL_STYLE from "./cbd11.json";

const ReactMap = ReactMapboxGl({
  accessToken: "pk.eyJ1IjoiYmxpc2h0ZW4iLCJhIjoiMEZrNzFqRSJ9.0QBRA2HxTb8YHErUFRMPZg",
  movingMethod: "jumpTo",
  hash: true
});

const INITIAL_CENTER = [20, -2];
const INITIAL_ZOOM = [6];
const INITIAL_STYLE = "mapbox://styles/blishten/cj6f4n2j026qf2rnunkauikjm";
const CONTAINER_STYLE = { height: "100vh", width: "100vw" };

class Map extends React.Component {
  render() {
    return (
      <ReactMap {...this.props} style= {INITIAL_STYLE} center={INITIAL_CENTER} zoom={INITIAL_ZOOM} containerStyle={CONTAINER_STYLE} ref={(elem)=>{this.reactMap=elem}}>              
        <MapPopup reactMap={this.reactMap} showPopup="mapClick" {...this.props}/>
      </ReactMap>
    );
  }
}

export default Map;
