import React, { Component } from 'react';
import './App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import MapToolbar from './MapToolbar.js';
import PoliciesDrawer from './PoliciesDrawer.js';
import ActionsDrawer from './ActionsDrawer.js';
import IndicatorCard from './IndicatorCard.js';
import ReactMapboxGl from "react-mapbox-gl";
import MapPopup from './MapPopup.js';
import { BrowserRouter as Router, Route } from "react-router-dom";

const Map = ReactMapboxGl({
  accessToken: "pk.eyJ1IjoiYmxpc2h0ZW4iLCJhIjoiMEZrNzFqRSJ9.0QBRA2HxTb8YHErUFRMPZg"
});
const INITIAL_CENTER = [20, -2];
const INITIAL_ZOOM = [3];
const INITIAL_STYLE = "mapbox://styles/blishten/cj6f4n2j026qf2rnunkauikjm";
const CONTAINER_STYLE = { height: "100vh", width: "100vw" };

class App extends Component {
  constructor(props) {
    super(props);
    window.basepath = (process.env.NODE_ENV === 'production') ? "/wireframes/regional/build/" : "/wireframes/regional/";
    this.state = { map: null, hoverPA: null, center: [0.5375194, 50.8437787], zoom: [11] };
  }
  mapLoaded(e) {
    // this.setState({ map: e });
  }
  showActionFundProposalsClicked(e) {
    this.setState({ showActions: !this.state.showActions });
  }
  onMouseMove(e) {
    var features = e.target.queryRenderedFeatures(e.point);
    if (features && features.length && features[0].layer.id === 'terrestrial-pas') {
      const yr = (features[0].properties.STATUS_YR !== 0) ? " (" + features[0].properties.STATUS_YR + ")" : "";
      console.log(features[0].properties.NAME + yr);
      this.setState({ text: features[0].properties.NAME + yr });
    }
    this.setState({text:features["0"].properties.class});
  }
  render() {
    return (
      <MuiThemeProvider>
        <div className="App">
          <AppBar title="BIOPAMA Regional Conservation Planning Tools" showMenuIconButton={false}/>
          <Router>
            <div>
              <Route path={window.basepath} render={props=>
                <PoliciesDrawer map={this.state.map} {...props}/>
              }/>
              <IndicatorCard map={this.state.map}/>
              <Map style= {INITIAL_STYLE} containerStyle={CONTAINER_STYLE} onStyleLoad={this.mapLoaded.bind(this)} onMouseMove={(map,e)=>this.onMouseMove(e)}>              
                <MapPopup text={this.state.text}/>
              </Map>
              <MapToolbar map={this.state.map}/>
              <ActionsDrawer map={this.state.map} showActionFundProposalsClicked={this.showActionFundProposalsClicked.bind(this)}/>
            </div>
          </Router>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
