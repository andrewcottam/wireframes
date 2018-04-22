import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import * as jsonp from 'jsonp';
import InfoPanel from './InfoPanel.js';
import Popup from './Popup.js';
import Loading from './loading.gif';

//CONSTANTS
let MARXAN_ENDPOINT = "https://db-server-blishten.c9users.io/marxan/webAPI/";
let NUMBER_OF_RUNS = 10;

mapboxgl.accessToken = 'pk.eyJ1IjoiYmxpc2h0ZW4iLCJhIjoiMEZrNzFqRSJ9.0QBRA2HxTb8YHErUFRMPZg';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      runParams: { 'numRuns': 10 },
      running: false,
      active_pu: undefined,
      log: 'No data',
      dataAvailable: false,
      outputsTabString: 'No data',
      popup_point: { x: 0, y: 0 },
      numRuns: 10
    };
    this.verbosity = "3";
  }

  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/blishten/cjg6jk8vg3tir2spd2eatu5fd',
      center: [0.043476868184143314, 0.0460817578557311],
      zoom: 12
    });
    this.map.on("load", this.mapLoaded.bind(this));
  }

  mapLoaded(e) {
    this.map.addControl(new mapboxgl.FullscreenControl(), 'bottom-right');
    this.map.addControl(new mapboxgl.ScaleControl());
    this.map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
    this.map.on("mousemove", this.mouseMove.bind(this));
  }

  setVerbosity(value) {
    this.verbosity = value;
  }

  //run a marxan job on the server
  runMarxan(e) {
    //update the ui to reflect the fact that a job is running
    this.setState({ running: true, log: 'Running...', active_pu: undefined, outputsTabString: 'Running...' });
    //if we are requesting more than 10 solutions, then we should not load all of them in the REST call - they can be requested asynchronously as and when they are needed
    this.returnall = this.state.numRuns > 10 ? 'false' : 'true';
    //make the request to get the marxan data
    jsonp(MARXAN_ENDPOINT + "run?numreps=" + this.state.numRuns + "&verbosity=" + this.verbosity + "&returnall=" + this.returnall, this.parseRunMarxanResponse.bind(this)); //get the data from the server and parse it
  }

  //pads a number with zeros to a specific size, e.g. pad(9,5) => 00009
  pad(num, size) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
  }
  
  //load a specific solution
  loadSolution(solution) {
    if (solution == "Sum") {
      //load the sum of solutions which will already be loaded
      this.renderSumSolutionMap(this.response.ssoln);
    }
    else {
      //see if the data are already loaded
      if (this.returnall == 'true') {
        //get the name of the REST response object which holds the data for the specific solution
        let _name = 'output_r' + this.pad(solution, 5);
        this.renderSolution(this.response[_name]);
      }
      else { 
        //request the data for the specific solution
        jsonp(MARXAN_ENDPOINT + "loadSolution?solution=" + solution, this.parseLoadSolutionResponse.bind(this));
      }
    }
  }

  parseRunMarxanResponse(err, response) {
    if (err) throw err;
    //get the response and store it in this component
    this.response = response;
    //if we have some data to map then set the state to reflect this
    (this.response.ssoln) ? this.setState({ dataAvailable: true }): this.setState({ dataAvailable: false });
    //render the sum solution map
    this.renderSumSolutionMap(this.response.ssoln);
    //create the array of solutions to pass to the InfoPanels table
    let solutions = response.sum;
    solutions.splice(0, 0, { 'Run_Number': 'Sum', 'Score': '', 'Cost': '', 'Planning_Units': '' });
    this.setState({ running: false, log: response.log.replace(/(\r\n|\n|\r)/g, "<br />"), outputsTabString: '', solutions: solutions });
  }

  parseLoadSolutionResponse(err, response) {
    if (err) throw err;
    this.renderSolution(response);
  }
  
  //renders the sum of solutions
  renderSumSolutionMap(data) {
    // Calculate color for each planning unit based on the total number of selections in the marxan runs
    var expression = ["match", ["get", "PUID"]];
    data.forEach(function(row) {
      var green = (row["number"] / NUMBER_OF_RUNS) * 255;
      var color = "rgba(" + 0 + ", " + green + ", " + 0 + ", 1)";
      expression.push(row["planning_unit"], color);
    });
    // Last value is the default, used where there is no data
    expression.push("rgba(0,0,0,0)");
    this.map.setPaintProperty("planning-units-3857-visible-a-0vmt87", "fill-color", expression);
  }
  
  //renders a specific solutions data
  renderSolution(data){
    // Calculate color for each planning unit 
    var expression = ["match", ["get", "PUID"]];
    data.forEach(function(row) {
      var red = row["solution"] * 255;
      var color = "rgba(" + red + ", " + 0 + ", " + 0 + ", 1)";
      expression.push(row["planning_unit"], color);
    });
    // Last value is the default, used where there is no data
    expression.push("rgba(0,0,0,0)");
    this.map.setPaintProperty("planning-units-3857-visible-a-0vmt87", "fill-color", expression);
  }
  
  mouseMove(e) {
    var features = this.map.queryRenderedFeatures(e.point);
    //get the planning unit features that are underneath the mouse
    if ((features.length) && (features[0].layer.id == "planning-units-3857-visible-a-0vmt87")) {
      //set the location for the popup
      if (!this.state.active_pu || (this.state.active_pu && this.state.active_pu.PUID !== features[0].properties.PUID)) this.setState({ popup_point: e.point });
      //get the properties from the vector tiles
      let vector_tile_properties = features[0].properties;
      //get the properties from the marxan results
      let marxan_results = this.response && this.response.ssoln ? this.response.ssoln.filter(item => item.planning_unit == vector_tile_properties.PUID)[0] : {};
      //combine the 2 sets of properties
      let active_pu = Object.assign(marxan_results, vector_tile_properties);
      //set the state to re-render the popup
      this.setState({ active_pu: active_pu });
    }
    else {
      this.setState({ active_pu: undefined });
    }
  }

  setNumRuns(e, v) {
    this.setState({ numRuns: v });
  }

  render() {
    return (
      <MuiThemeProvider>
        <React.Fragment>
          <div ref={el => this.mapContainer = el} className="absolute top right left bottom" />
          <InfoPanel runParams={this.state.runParams} 
                    runMarxan={this.runMarxan.bind(this)} 
                    loadSolution={this.loadSolution.bind(this)} 
                    running={this.state.running} 
                    outputsTabString={this.state.outputsTabString} 
                    log={this.state.log} 
                    dataAvailable={this.state.dataAvailable} 
                    setVerbosity={this.setVerbosity.bind(this)} 
                    solutions={this.state.solutions}
                    setNumRuns={this.setNumRuns.bind(this)}
                    numRuns={this.state.numRuns}/>
          <img src={Loading} id='loading' style={{'display': (this.state.running ? 'block' : 'none')}}/>
          <Popup active_pu={this.state.active_pu} xy={this.state.popup_point}/>
        </React.Fragment>
      </MuiThemeProvider>
    );
  }
}

export default App;
