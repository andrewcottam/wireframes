import React, { Component } from 'react';
import './App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import MapToolbar from './MapToolbar.js';
import PoliciesDrawer from './PoliciesDrawer.js';
import ActionsDrawer from './ActionsDrawer.js';
import IndicatorCard from './IndicatorCard.js';
import mapboxgl from 'mapbox-gl';
import { BrowserRouter as Router, Route } from "react-router-dom";

class Map extends React.Component {
  componentDidMount() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiYmxpc2h0ZW4iLCJhIjoiMEZrNzFqRSJ9.0QBRA2HxTb8YHErUFRMPZg'; //this is my access token
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      center: [21, -2], //salonga
      zoom: 3,
      style: 'mapbox://styles/blishten/cj6f4n2j026qf2rnunkauikjm'
    });
    this.map.on("load", (e) => this.props.onLoad(e));
  }

  componentWillUnmount() {
    this.map.remove();
  }

  render() {
    const style = {
      position: 'absolute',
      top: 0,
      bottom: 0,
      width: '100%'
    };
    return <div style={style} ref={el => this.mapContainer = el} />;
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    window.basepath = (process.env.NODE_ENV === 'production') ? "/wireframes/regional/build/" : "/wireframes/regional/";
    this.state = { map: null, showActions: false, popupVisible: false };
  }
  mapLoaded(e) {
    this.setState({ map: e.target });
  }
  showActionFundProposalsClicked(e) {
    this.setState({ showActions: !this.state.showActions });
  }
  onMouseMove(e) {
    var features = this.state.map && this.state.map.queryRenderedFeatures(e.point);
    if (features && features.length && features[0].layer.id === 'terrestrial-pas') {
      const yr = (features[0].properties.STATUS_YR !== 0) ? " (" + features[0].properties.STATUS_YR + ")" : "";
      console.log(features[0].properties.NAME + yr);
      this.setState({ popupVisible: true });
    }
    else {
      this.setState({ popupVisible: false });
    }
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
              <Map onLoad={this.mapLoaded.bind(this)}/>
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
