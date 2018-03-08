import React, { Component } from 'react';
import './App.css';
import ReactMapboxGl, { Popup } from "react-mapbox-gl";

const Map = ReactMapboxGl({
  accessToken: "pk.eyJ1IjoiYmxpc2h0ZW4iLCJhIjoiMEZrNzFqRSJ9.0QBRA2HxTb8YHErUFRMPZg"
});

const INITIAL_CENTER = [20, -2];
const INITIAL_ZOOM = [9];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { text: "wibble", center: INITIAL_CENTER };
  }
  onMouseMove(e) {
    var features = e.target.queryRenderedFeatures(e.point);
    features && features.length && this.setState({ text: features["0"].properties.class });
    this.setState({ center: [e.lngLat.lng, e.lngLat.lat] });
  }
  render() {
    return (
      <Map
        style="mapbox://styles/mapbox/streets-v9"
        onMouseMove={(map,e)=>this.onMouseMove(e)}
        center={INITIAL_CENTER}
        zoom={INITIAL_ZOOM}
        containerStyle={{
          height: "100vh",
          width: "100vw"
        }}>
        <Popup coordinates={this.state.center} offset={{'bottom-left': [12, -38],  'bottom': [0, -38], 'bottom-right': [-12, -38]}}>
          <h1>{this.state.text}</h1>
        </Popup>
      </Map>
    );
  }
}

export default App;
