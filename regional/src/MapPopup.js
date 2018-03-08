import * as React from 'react';
import { Popup } from "react-mapbox-gl";

class MapPopup extends React.Component {
  render() {
    return (
        <Popup coordinates={[0,0]}>
          <h1>{this.props.text}</h1>
        </Popup>
    );
  }
}

export default MapPopup;