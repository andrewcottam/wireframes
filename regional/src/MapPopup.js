import * as React from 'react';
import { Popup } from "react-mapbox-gl";

class MapPopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = { mouseCentre: null, mouseFeatures: null };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.reactMap) {
      this.mapboxgl = nextProps.reactMap.state.map; //get the mapbox-gl javascript object
      this.mapboxgl.on("mousemove", this.mouseMove.bind(this));
      console.log("mousemove event handler added");
    }
  }
  componentWillUnmount() {
    this.mapboxgl && this.mapboxgl.off("mousemove", this.mouseMove);
    console.log("mousemove event handler removed");
  }
  mouseMove(e) {
    var features = e.target.queryRenderedFeatures(e.point);
    this.setState({ mouseFeatures: features, mouseCentre: [e.lngLat.lng, e.lngLat.lat] });
  }
  getText() {
    const txt = this.state.mouseFeatures.filter((f) => ['terrestrial-pas', 'terrestrial-pas-active'].indexOf(f.layer.id) > -1).map((f) => {
      const yr = (f.properties.STATUS_YR !== 0) ? " (" + f.properties.STATUS_YR + ")" : "";
      return (
        <div key={f.properties.WDPAID}>{f.properties.NAME + yr}</div>
      );
    });
    return txt;
  }
  render() {
    const text = this.state.mouseFeatures && this.getText();
    return (
      this.state.mouseCentre && this.state.mouseCentre.length && text.length &&
      <Popup coordinates={this.state.mouseCentre} offset={12}>
        <div>{text}</div>
      </Popup>
    );
  }
}

export default MapPopup;
