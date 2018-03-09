import * as React from 'react';
import { Popup } from "react-mapbox-gl";
import mapboxgl from 'mapbox-gl';

class MapPopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = { mouseCentre: null, mouseFeatures: null };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.reactMap) {
      this.mapboxgl = nextProps.reactMap.state.map; //get the mapbox-gl javascript object
      this.props.showPopup === "mousemove" && this.mapboxgl.on("mousemove", this.mouseMove.bind(this));
      this.props.showPopup === "mapClick" && this.mapboxgl.on("click", this.mapClick.bind(this));
    }
  }
  componentWillUnmount() {
    this.props.showPopup === "mousemove" && this.mapboxgl && this.mapboxgl.off("mousemove", this.mouseMove);
    this.props.showPopup === "mapClick" && this.mapboxgl.off("click", this.mapClick.bind(this));
  }
  mouseMove(e) {
    var features = e.target.queryRenderedFeatures(e.point);
    this.setState({ mouseFeatures: features, mouseCentre: [e.lngLat.lng, e.lngLat.lat] });
  }
  mapClick(e) {
    var features = e.target.queryRenderedFeatures(e.point);
    this.setState({ mouseFeatures: features, mouseCentre: [e.lngLat.lng, e.lngLat.lat] });
  }
  getText() {
    const txt = this.state.mouseFeatures.filter((f) => ['terrestrial-pas', 'terrestrial-pas-active'].indexOf(f.layer.id) > -1).map((f) => {
      const yr = (f.properties.STATUS_YR !== 0) ? " (" + f.properties.STATUS_YR + ")" : "";
      return (
        <div key={f.properties.WDPAID} className="popupItem" onClick={this.itemClick.bind(this,f.geometry.coordinates)}>{f.properties.NAME + yr}</div>
      );
    });
    return txt;
  }
  getBoundingBox(coordinates) {
    var bounds = new mapboxgl.LngLatBounds();
    coordinates[0].map((coord) => {
      bounds.extend(new mapboxgl.LngLat(coord[0], coord[1]));
    });
    return bounds;
  }
  itemClick(coordinates) {
    const bounds = this.getBoundingBox(coordinates);
    this.mapboxgl.fitBounds(bounds, {
      padding: 70
    });
    // this.props.history.push({
    //   pathname: window.basepath + "pa/" + wdpaid
    // });
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
