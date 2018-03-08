import * as React from 'react';
import ReactMapboxGl from "react-mapbox-gl";
import FeatureLayer from './FeatureLayer.js';
import { Popup } from "react-mapbox-gl";

const ReactMap = ReactMapboxGl({
  accessToken: "pk.eyJ1IjoiYmxpc2h0ZW4iLCJhIjoiMEZrNzFqRSJ9.0QBRA2HxTb8YHErUFRMPZg"
});

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = { mapCenter: [21, -2], style: "mapbox://styles/blishten/cj6f4n2j026qf2rnunkauikjm", zoom: [3], showActions: false };
  }
  onMoveEnd(e) {
    this.setState({
      mapCenter: e.target.getCenter(),
      zoom: e.target.getZoom()
    });
  }
  render() {
    const style = (this.props.popupVisible) ? { display: 'block' } : { display: 'none' };
    return (
      <ReactMap {...this.props} onMouseMove={(map,e)=>this.props.onMouseMove && this.props.onMouseMove(e)} center={this.state.mapCenter} zoom={this.state.zoom} style={this.state.style} onMoveEnd={(map,e)=>this.onMoveEnd(e)}>
        <FeatureLayer visible={this.props.showActions}/>
          <Popup coordinates={[20,0]} style={style}>
            <h1>Popup</h1>
          </Popup>      
      </ReactMap>
    );
  }
}

export default Map;
