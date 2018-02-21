import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import mapboxgl from 'mapbox-gl';
import MapToolbar from './MapToolbar.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { map: null };
  }
  mapLoaded(e) {
    this.setState({ map: e.target });
  }
  render() {
    return (
      <MuiThemeProvider>
        <div className="App">
          <AppBar title="Biopama ACP Conservation Knowledge Centre" showMenuIconButton={false}/>
          {/* <Map onLoad={this.mapLoaded.bind(this)}/>
           <MapToolbar map={this.state.map}/> */}
        </div>
      </MuiThemeProvider>
    );
  }
}

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

export default App;