import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import * as jsonp from 'jsonp';
import InfoPanel from './InfoPanel.js';
import Popup from './Popup.js';
import Loading from './loading.gif';
import Login from './login.js';
import Snackbar from 'material-ui/Snackbar';

//CONSTANTS
//THE MARXAN_ENDPOINT MUST ALSO BE CHANGED IN THE FILEUPLOAD.JS FILE
let MARXAN_ENDPOINT = "https://db-server-blishten.c9users.io/marxan/webAPI2/";
let NUMBER_OF_RUNS = 10;

mapboxgl.accessToken = 'pk.eyJ1IjoiYmxpc2h0ZW4iLCJhIjoiMEZrNzFqRSJ9.0QBRA2HxTb8YHErUFRMPZg';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user: 'logged out',
      scenario: '',
      userValidated: undefined,
      runParams: [],
      files: {},
      running: false,
      active_pu: undefined,
      log: 'No data',
      dataAvailable: false,
      outputsTabString: 'No data',
      popup_point: { x: 0, y: 0 },
      numRuns: 10,
      snackbarOpen: false,
      snackbarMessage: ''
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

  componentDidUpdate(prevProps, prevState) {
    //if the user has logged in and the state has been set we can now load the scenario
    if (this.state.user !== 'logged out' && prevState.user === 'logged out') {
      this.loadScenario('Sample scenario');
    }
  }
  mapLoaded(e) {
    // this.map.addControl(new mapboxgl.FullscreenControl(), 'bottom-right'); // currently full screen hides the info panel and setting position:absolute and z-index: 10000000000 doesnt work properly
    this.map.addControl(new mapboxgl.ScaleControl());
    this.map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
    this.map.on("mousemove", this.mouseMove.bind(this));
  }

  setVerbosity(value) {
    this.verbosity = value;
  }

  validateUser(user) {
    //set the validation state to undefined
    this.setState({ userValidated: undefined });
    //set the user trying to log in
    this.userToValidate = user;
    //get a list of existing users
    this.getUsers();
  }

  getUsers() {
    //Get a user list
    jsonp(MARXAN_ENDPOINT + "listUsers", this.parseGetUsersResponse.bind(this));
  }

  parseGetUsersResponse(err, response) {
    this.getUsersResponse = response;
    //the user already exists
    if (response.users.indexOf(this.userToValidate) > -1) {
      //user validated
      this.setState({ userValidated: true });
    }
    else {
      //user not validated
      this.setState({ userValidated: false });
    }
  }

  login(user) {
    this.setState({ user: user });
  }

  logout() {
    this.setState({ user: 'logged out', userValidated: undefined, scenario: '', scenarios: [] });
  }

  loadScenario(scenario) {
    jsonp(MARXAN_ENDPOINT + "getScenario?user=" + this.state.user + "&scenario=" + scenario, this.parseLoadScenarioResponse.bind(this));
  }

  parseLoadScenarioResponse(err, response) {
    if (response.error === undefined) {
      this.setState({ scenario: response.scenario, runParams: response.runParameters, files: response.files });
    }
    else {
      //ui feedback
      this.setState({ snackbarOpen: true, snackbarMessage: response.error });
    }
  }

  fileUploaded(parameter, filename) {
    let files = Object.assign(this.state.files, { [parameter]: filename });
    this.setState({ files: files });
  }

  //create a new user on the server
  createNewUser(user) {
    //set the userCreated state to undefined
    this.setState({ userValidated: undefined });
    jsonp(MARXAN_ENDPOINT + "createUser?user=" + user, this.parseCreateNewUserResponse.bind(this));
  }

  parseCreateNewUserResponse(err, response) {
    if (response.error === undefined) {
      this.setState({ userCreated: true });
    }
    else {
      this.setState({ userCreated: false });
      //ui feedback
      this.setState({ snackbarOpen: true, snackbarMessage: response.error });
    }
  }

  createNewScenario(scenario) {
    if (scenario.description) {
      jsonp(MARXAN_ENDPOINT + "createScenario?user=" + this.state.user + "&scenario=" + scenario.name + "&description=" + scenario.description, this.parseCreateNewScenarioResponse.bind(this));
    }
    else {
      jsonp(MARXAN_ENDPOINT + "createScenario?user=" + this.state.user + "&scenario=" + scenario.name, this.parseCreateNewScenarioResponse.bind(this));
    }
  }

  parseCreateNewScenarioResponse(err, response) {
    if (response.error === undefined) {
      //refresh the scenarios list
      this.listScenarios();
    }
    else {
      //ui feedback
      this.setState({ snackbarOpen: true, snackbarMessage: response.error });
    }
  }

  deleteScenario(name) {
    jsonp(MARXAN_ENDPOINT + "deleteScenario?user=" + this.state.user + "&scenario=" + name, this.parseDeleteScenarioResponse.bind(this));
  }

  parseDeleteScenarioResponse(err, response) {
    if (response.error === undefined) {
      //refresh the scenarios list
      this.listScenarios();
      //ui feedback
      this.setState({ snackbarOpen: true, snackbarMessage: "Scenario deleted" });
    }
    else {
      //ui feedback
      this.setState({ snackbarOpen: true, snackbarMessage: response.error });
    }

  }
  //run a marxan job on the server
  runMarxan(e) {
    //update the ui to reflect the fact that a job is running
    this.setState({ running: true, log: 'Running...', active_pu: undefined, outputsTabString: 'Running...' });
    //if we are requesting more than 10 solutions, then we should not load all of them in the REST call - they can be requested asynchronously as and when they are needed
    this.returnall = this.state.numRuns > 10 ? 'false' : 'true';
    //make the request to get the marxan data
    jsonp(MARXAN_ENDPOINT + "runMarxan?user=" + this.state.user + "&scenario=" + this.state.scenario + "&numreps=" + this.state.numRuns + "&verbosity=" + this.verbosity + "&returnall=" + this.returnall, this.parseRunMarxanResponse.bind(this)); //get the data from the server and parse it
  }

  //pads a number with zeros to a specific size, e.g. pad(9,5) => 00009
  pad(num, size) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
  }

  //load a specific solution
  loadSolution(solution) {
    if (solution === "Sum") {
      //load the sum of solutions which will already be loaded
      this.renderSumSolutionMap(this.runMarxanResponse.ssoln);
    }
    else {
      //see if the data are already loaded
      if (this.returnall === 'true') {
        //get the name of the REST response object which holds the data for the specific solution
        let _name = 'output_r' + this.pad(solution, 5);
        this.renderSolution(this.runMarxanResponse[_name]);
      }
      else {
        //request the data for the specific solution
        jsonp(MARXAN_ENDPOINT + "loadSolution?user=" + this.state.user + "&scenario=" + this.state.scenario + "&solution=" + solution, this.parseLoadSolutionResponse.bind(this));
      }
    }
  }

  parseRunMarxanResponse(err, response) {
    var solutions;
    if (response.error) {
      solutions = [];
    }
    else {
      //get the response and store it in this component
      this.runMarxanResponse = response;
      //if we have some data to map then set the state to reflect this
      (this.runMarxanResponse.ssoln) ? this.setState({ dataAvailable: true }): this.setState({ dataAvailable: false });
      //render the sum solution map
      this.renderSumSolutionMap(this.runMarxanResponse.ssoln);
      //create the array of solutions to pass to the InfoPanels table
      solutions = response.sum;
      solutions.splice(0, 0, { 'Run_Number': 'Sum', 'Score': '', 'Cost': '', 'Planning_Units': '' });
    }
    this.setState({ running: false, log: response.log.replace(/(\r\n|\n|\r)/g, "<br />"), outputsTabString: '', solutions: solutions });
  }

  parseLoadSolutionResponse(err, response) {
    (response.error) ? console.error("Marxan: " + response.error): this.renderSolution(response.solution);
  }

  listScenarios() {
    jsonp(MARXAN_ENDPOINT + "listScenarios?user=" + this.state.user, this.parseListScenariosResponse.bind(this));

  }

  parseListScenariosResponse(err, response) {
    if (response.error === undefined) {
      this.setState({ scenarios: response.scenarios });
    }
    else {
      this.setState({ scenarios: undefined });
    }
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
  renderSolution(data) {
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
    if ((features.length) && (features[0].layer.id === "planning-units-3857-visible-a-0vmt87")) {
      //set the location for the popup
      if (!this.state.active_pu || (this.state.active_pu && this.state.active_pu.PUID !== features[0].properties.PUID)) this.setState({ popup_point: e.point });
      //get the properties from the vector tiles
      let vector_tile_properties = features[0].properties;
      //get the properties from the marxan results
      let marxan_results = this.runMarxanResponse && this.runMarxanResponse.ssoln ? this.runMarxanResponse.ssoln.filter(item => item.planning_unit === vector_tile_properties.PUID)[0] : {};
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

  spatialLayerChanged(tileset, zoomToBounds) {
    this.removeSpatialLayer();
    this.addSpatialLayer(tileset);
    this.zoomToBounds(tileset.bounds);
    this.setState({ tileset: tileset });
  }

  removeSpatialLayer() {
    let layers = this.map.getStyle().layers;
    let layerId = layers[layers.length - 1].id;
    this.map.removeLayer(layerId);
  }

  addSpatialLayer(tileset) {
    this.map.addLayer({
      'id': tileset.name,
      'type': "fill",
      'source': {
        'type': "vector",
        'url': "mapbox://" + tileset.id
      },
      'source-layer': tileset.vector_layers[0].id,
      'paint': {
        'fill-color': '#f08',
        'fill-opacity': 0.4
      }
    });
  }
  zoomToBounds(bounds) {
    let minLng = (bounds[0] < -180) ? -180 : bounds[0];
    let minLat = (bounds[1] < -90) ? -90 : bounds[1];
    let maxLng = (bounds[2] > 180) ? 180 : bounds[2];
    let maxLat = (bounds[3] > 90) ? 90 : bounds[3];
    this.map.fitBounds([minLng, minLat, maxLng, maxLat], {
      padding: { top: 10, bottom: 10, left: 10, right: 10 }
    });
  }

  render() {
    return (
      <MuiThemeProvider>
        <React.Fragment>
          <div ref={el => this.mapContainer = el} className="absolute top right left bottom" />
          <InfoPanel
            user={this.state.user}
            listScenarios={this.listScenarios.bind(this)}
            scenarios={this.state.scenarios}
            scenario={this.state.scenario}
            logout={this.logout.bind(this)}
            runParams={this.state.runParams} 
            files={this.state.files}
            fileUploaded={this.fileUploaded.bind(this)}
            runMarxan={this.runMarxan.bind(this)} 
            loadSolution={this.loadSolution.bind(this)} 
            running={this.state.running} 
            outputsTabString={this.state.outputsTabString} 
            dataAvailable={this.state.dataAvailable} 
            setVerbosity={this.setVerbosity.bind(this)} 
            solutions={this.state.solutions}
            setNumRuns={this.setNumRuns.bind(this)}
            numRuns={this.state.numRuns}
            log={this.state.log} 
            spatialLayerChanged={this.spatialLayerChanged.bind(this)}
            createNewScenario={this.createNewScenario.bind(this)}
            deleteScenario={this.deleteScenario.bind(this)}
            loadScenario={this.loadScenario.bind(this)}
            />
          <img src={Loading} id='loading' style={{'display': (this.state.running ? 'block' : 'none')}} alt='loading'/>
          <Popup active_pu={this.state.active_pu} xy={this.state.popup_point}/>
          <Login validateUser={this.validateUser.bind(this)} userValidated={this.state.userValidated} login={this.login.bind(this)} createNewUser={this.createNewUser.bind(this)} userCreated={this.state.userCreated}/>
          <Snackbar
            open={this.state.snackbarOpen}
            message={this.state.snackbarMessage}
            autoHideDuration={4000}
            onRequestClose={this.handleRequestClose}
          />
        </React.Fragment>
      </MuiThemeProvider>
    );
  }
}

export default App;
