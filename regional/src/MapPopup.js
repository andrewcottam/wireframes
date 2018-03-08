import * as React from 'react';
import { Popup } from "react-mapbox-gl";

class MapPopup extends React.Component {
  render() {
    return (
      <Popup coordinates={this.props.center} offset={{'bottom-left': [12, -38],  'bottom': [0, -38], 'bottom-right': [-12, -38]}}>
        <h1>{this.props.text}</h1>
      </Popup>
    );
  }
}

export default MapPopup;