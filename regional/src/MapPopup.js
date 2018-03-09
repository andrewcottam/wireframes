import * as React from 'react';
import { Popup } from "react-mapbox-gl";

class MapPopup extends React.Component {
  getText() {
    const txt = this.props.mouseFeatures.filter((f) => ['terrestrial-pas', 'terrestrial-pas-active'].indexOf(f.layer.id) > -1).map((f) => {
      const yr = (f.properties.STATUS_YR !== 0) ? " (" + f.properties.STATUS_YR + ")" : "";
      return (
        <div key={f.properties.WDPAID}>{f.properties.NAME + yr}</div>
      );
    });
    return txt;
  }
  render() {
    const text = this.getText();
    return (
      this.props.mouseCentre.length && text.length &&
      <Popup coordinates={this.props.mouseCentre} offset={12}>
        <div>{text}</div>
      </Popup>
    );
  }
}

export default MapPopup;
