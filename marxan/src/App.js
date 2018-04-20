import React from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoiYmxpc2h0ZW4iLCJhIjoiMEZrNzFqRSJ9.0QBRA2HxTb8YHErUFRMPZg';

class App extends React.Component {

  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/blishten/cjg6jk8vg3tir2spd2eatu5fd',
      center: [0.05,0.049],
      zoom: 12
    });
  }

  render() {

    return (
      <div ref={el => this.mapContainer = el} className="absolute top right left bottom" />
    );
  }
}

export default App;
