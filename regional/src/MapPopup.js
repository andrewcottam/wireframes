import * as React from 'react';
import { Popup } from "react-mapbox-gl";

class MapPopup extends React.Component {
  render() {
    return (
      <Popup style={this.props.text==="" ? {display:'none'} : {display:'flex'}} coordinates={this.props.center}>
        <div>{this.props.text}</div>
      </Popup>
    );
  }
}

export default MapPopup;

