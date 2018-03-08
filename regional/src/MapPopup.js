import * as React from 'react';
import { Popup } from "react-mapbox-gl";

class MapPopup extends React.Component {
  getText() {
    const txt = this.props.mouseFeatures.filter((feature) => feature.layer.id === 'terrestrial-pas').map((feature) => {
      if (feature.layer.id === 'terrestrial-pas') {
        const yr = (feature.properties.STATUS_YR !== 0) ? " (" + feature.properties.STATUS_YR + ")" : "";
        return (
          <div key={feature.properties.WDPAID}>{feature.properties.NAME + yr}</div>
        );
      }
    });
    return txt;
  }
  render() {
    const text = this.getText();
    return (
      this.props.mouseCentre.length && text.length &&
      <Popup style={text==="" ? {display:'none'} : {display:'flex'}} coordinates={this.props.mouseCentre}>
        <div>{text}</div>
      </Popup>
    );
  }
}

export default MapPopup;
