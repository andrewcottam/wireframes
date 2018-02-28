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
    window.basepath = (process.env.NODE_ENV==='production') ? "/wireframes/regional/build/" : "/wireframes/regional/";
    this.state = { map: null };
  }
  mapLoaded(e) {
    this.setState({ map: e.target });
  }
  render() {
    return (
      <MuiThemeProvider>
        <div className="App">
          <AppBar title="Biopama Regional Conservation Planning Tools" showMenuIconButton={false}/>
          <PoliciesDrawer map={this.state.map}/>
          <Router>
            <div>
              <Route path={window.basepath + "i/:id"} render={props => <IndicatorCard {...props} map={this.state.map}/>}/>
            </div>
              </Router>
          <Map onLoad={this.mapLoaded.bind(this)}/>
          <MapToolbar map={this.state.map}/>
          <ActionsDrawer/>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
