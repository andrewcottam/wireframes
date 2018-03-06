import * as React from 'react';
import ReactMapboxGl from "react-mapbox-gl";
import FeatureLayer from './FeatureLayer.js';

const ReactMap = ReactMapboxGl({
  accessToken: "pk.eyJ1IjoiYmxpc2h0ZW4iLCJhIjoiMEZrNzFqRSJ9.0QBRA2HxTb8YHErUFRMPZg"
});

class Map extends React.Component {
  constructor(props){
    super(props);
    this.state = {showActions: false};
  }
  componentWillMount() {
    this.setState({ mapCenter: [21, -2], style: "mapbox://styles/blishten/cj6f4n2j026qf2rnunkauikjm", zoom: [3] });
  }
  render() {
    return (
      <ReactMap {...this.props} center={this.state.mapCenter} style={this.state.style} zoom={this.state.zoom}>
        <FeatureLayer visible={this.props.showActions}/>
      </ReactMap>
    );
  }
}

export default Map;
