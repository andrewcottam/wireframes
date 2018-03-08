import * as React from 'react';
import ReactMapboxGl from "react-mapbox-gl";
import { Popup } from "react-mapbox-gl";

const ReactMap = ReactMapboxGl({
  accessToken: "pk.eyJ1IjoiYmxpc2h0ZW4iLCJhIjoiMEZrNzFqRSJ9.0QBRA2HxTb8YHErUFRMPZg"
});

class Map extends React.Component {
  onMouseMove(e) {
    var features = e.target.queryRenderedFeatures(e.point);
    if (features && features.length && features[0].layer.id === 'terrestrial-pas') {
      const yr = (features[0].properties.STATUS_YR !== 0) ? " (" + features[0].properties.STATUS_YR + ")" : "";
      console.log(features[0].properties.NAME + yr);
    }
  }
  render() {
    return (
      <ReactMap style= "mapbox://styles/blishten/cj6f4n2j026qf2rnunkauikjm" containerStyle={{ height: "100vh",width: "100vw"}} />
    );
  }
}

export default Map;
