import * as React from 'react';
import ReactMapboxGl from "react-mapbox-gl";
import { ZoomControl } from "react-mapbox-gl";
import { ScaleControl } from "react-mapbox-gl";
import { RotationControl } from "react-mapbox-gl";
import MapPopup from './MapPopup.js';
// import INITIAL_STYLE from "./cbd11.json";

const ReactMap = ReactMapboxGl({
  accessToken: "pk.eyJ1IjoiYmxpc2h0ZW4iLCJhIjoiMEZrNzFqRSJ9.0QBRA2HxTb8YHErUFRMPZg",
  movingMethod: "jumpTo",
  hash: false
});

const INITIAL_CENTER = [0, 0];
const INITIAL_ZOOM = [2];
const INITIAL_STYLE = "mapbox://styles/blishten/cj6f4n2j026qf2rnunkauikjm";
const CONTAINER_STYLE = { height: "100vh", width: "100vw" };

class Map extends React.Component {
  getContent(mouseFeatures, popup) {
    const txt = mouseFeatures.filter((f) => ['terrestrial-pas', 'terrestrial-pas-active'].indexOf(f.layer.id) > -1).map((f) => {
      const yr = (f.properties.STATUS_YR !== 0) ? " (" + f.properties.STATUS_YR + ")" : "";
      return (
        <div key={f.properties.WDPAID} className="popupItem" onClick={popup.itemClick.bind(popup, f.geometry.coordinates)}>{f.properties.NAME + yr}</div>
      );
    });
    return txt;
  }
  render() {
    return (
      <ReactMap {...this.props} style= {INITIAL_STYLE} center={INITIAL_CENTER} zoom={INITIAL_ZOOM} containerStyle={CONTAINER_STYLE} ref={(elem)=>{this.reactMap=elem}}>              
        <MapPopup reactMap={this.reactMap} showPopup="mapClick" {...this.props} getContent={this.getContent.bind(this)}/>
        <ZoomControl/>
        <ScaleControl style={{bottom:'80px',right:'20px'}}/>
        <RotationControl/>
      </ReactMap>
    );
  }
}

export default Map;
