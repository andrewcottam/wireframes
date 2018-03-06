import React, { Component } from 'react';
import './App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import MapToolbar from './MapToolbar.js';
import PoliciesDrawer from './PoliciesDrawer.js';
import ActionsDrawer from './ActionsDrawer.js';
import IndicatorCard from './IndicatorCard.js';
import ReactMapboxGl from "react-mapbox-gl";
import { BrowserRouter as Router, Route } from "react-router-dom";

const Map = ReactMapboxGl({
  accessToken: "pk.eyJ1IjoiYmxpc2h0ZW4iLCJhIjoiMEZrNzFqRSJ9.0QBRA2HxTb8YHErUFRMPZg"
});

class App extends Component {
  constructor(props) {
    super(props);
    window.basepath = (process.env.NODE_ENV === 'production') ? "/wireframes/regional/build/" : "/wireframes/regional/";
    this.state = { map: null };
  }
  mapLoaded(e) {
    this.setState({ map: e });
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
              <Map style={"mapbox://styles/blishten/cj6f4n2j026qf2rnunkauikjm"} center={[21, -2]} zoom={[3]} containerStyle={{ height: "100vh", width: "100vw"}} onStyleLoad={this.mapLoaded.bind(this)}/>
              <MapToolbar map={this.state.map}/>
              <ActionsDrawer map={this.state.map}/>
            </div>
          </Router>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
