import React, { Component } from 'react';
import './App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import MapToolbar from './MapToolbar.js';
import PoliciesDrawer from './PoliciesDrawer.js';
import ActionsDrawer from './ActionsDrawer.js';
import IndicatorCard from './IndicatorCard.js';
import Map from './Map.js';
import { BrowserRouter as Router, Route } from "react-router-dom";

class App extends Component {
  constructor(props) {
    super(props);
    window.basepath = (process.env.NODE_ENV === 'production') ? "/wireframes/regional/build/" : "/wireframes/regional/";
    this.state = { map: null };
  }
  mapLoaded(e) {
    this.setState({ map: e });
  }
  showActionFundProposalsClicked(e) {
    this.setState({ showActions: !this.state.showActions });
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
              <Map containerStyle={{ height: "100vh", width: "100vw"}} onStyleLoad={this.mapLoaded.bind(this)} showActions={this.state.showActions}/>
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
