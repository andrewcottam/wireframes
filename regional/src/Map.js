import * as React from 'react';
import ReactMapboxGl from "react-mapbox-gl";
import MapPopup from './MapPopup.js';

const ReactMap = ReactMapboxGl({
  accessToken: "pk.eyJ1IjoiYmxpc2h0ZW4iLCJhIjoiMEZrNzFqRSJ9.0QBRA2HxTb8YHErUFRMPZg"
});

const INITIAL_CENTER = [20, -2];
const INITIAL_ZOOM = [6];
const INITIAL_STYLE = "mapbox://styles/blishten/cj6f4n2j026qf2rnunkauikjm";
const CONTAINER_STYLE = { height: "100vh", width: "100vw" };

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = { text: "", center: INITIAL_CENTER };
  }
  onMouseMove(e) {
    var features = e.target.queryRenderedFeatures(e.point);
    if (features && features.length) {
      if (features[0].layer.id === 'terrestrial-pas'){
        const yr = (features[0].properties.STATUS_YR !== 0) ? " (" + features[0].properties.STATUS_YR + ")" : "";
        this.setState({ text: features[0].properties.NAME + yr });
        this.setState({ center: [e.lngLat.lng, e.lngLat.lat] });
      }
    }
    else {
      this.setState({ text: "" });
    }
  }
  render() {
    return (
      <ReactMap {...this.props} style= {INITIAL_STYLE} center={INITIAL_CENTER} zoom={INITIAL_ZOOM} containerStyle={CONTAINER_STYLE} onMouseMove={(map,e)=>this.onMouseMove(e)} >              
        <MapPopup text={this.state.text} center={this.state.center}/>
      </ReactMap>
    );
  }
}

export default Map;
