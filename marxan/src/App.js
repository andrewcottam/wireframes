/*global fetch*/
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
import MapboxClient from 'mapbox';
import FontAwesome from 'react-fontawesome';

//CONSTANTS
//THE MARXAN_ENDPOINT MUST ALSO BE CHANGED IN THE FILEUPLOAD.JS FILE
let MARXAN_ENDPOINT = "https://db-server-blishten.c9users.io/marxan/webAPI2/";
let NUMBER_OF_RUNS = 10;

mapboxgl.accessToken = 'pk.eyJ1IjoiYmxpc2h0ZW4iLCJhIjoiMEZrNzFqRSJ9.0QBRA2HxTb8YHErUFRMPZg';
mapboxgl.secretAccessToken = 'sk.eyJ1IjoiYmxpc2h0ZW4iLCJhIjoiY2piNm1tOGwxMG9lajMzcXBlZDR4aWVjdiJ9.Z1Jq4UAgGpXukvnUReLO1g';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user: 'logged out',
      loggingIn: false,
      scenario: '',
      editingScenarioName: false,
      validatingUser: false,
      validUser: undefined,
      runParams: [],
      files: {},
      running: false,
      runnable: false,
      active_pu: undefined,
      log: 'No data',
      dataAvailable: false,
      outputsTabString: 'No data',
      popup_point: { x: 0, y: 0 },
      numRuns: 10,
      snackbarOpen: false,
      snackbarMessage: '',
      tilesets: []
    };
    this.verbosity = "3";
  }

  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      // style: 'mapbox://styles/blishten/cjg6jk8vg3tir2spd2eatu5fd',
      style: 'mapbox://styles/blishten/cj6q75jcd39gq2rqm1d7yv5rc',
      center: [0.043476868184143314, 0.0460817578557311],
      zoom: 12
    });
    this.map.on("load", this.mapLoaded.bind(this));
    //get the tilesets for the user
    this.client = new MapboxClient(mapboxgl.secretAccessToken);
    this.client.listTilesets(this.parseTilesets.bind(this));
  }
  //callback function with the tileset info for the user
  parseTilesets(err, tilesets) {
    this.setState({ tilesets: tilesets });
  }
  //called if the tileset select box is changed
  changeTileset(tilesetid) {
    this.getMetadata(tilesetid).then(this.metadataRetrieved.bind(this));
    this.setState({ tilesetid: tilesetid });
  }
  //gets all of the info for the tileset
  getMetadata(tilesetId) {
    return fetch("https://api.mapbox.com/v4/" + tilesetId + ".json?secure&access_token=" + mapboxgl.secretAccessToken)
      .then(response => response.json())
      .then(function(response) {
        return response;
      })
      .catch(function(error) {
        return error;
      });
  }
  //callback function for the response from the call to get the tileset metadata
  metadataRetrieved(response) {
    this.spatialLayerChanged(response, true);
  }

  componentDidUpdate(prevProps, prevState) {
    //if the user has logged in and the state has been set we can now load the scenario
    if (this.state.user !== 'logged out' && prevState.user === 'logged out') {
      this.getUsersLastScenario();
    }
    //if any files have been uploaded then check to see if we have all of the mandatory file inputs - if so, set the state to being runnable
    if (this.state.files !== prevState.files) {
      (this.state.files.SPECNAME !== '' && this.state.files.PUNAME !== '' && this.state.files.PUVSPRNAME !== '') ? this.setState({ runnable: true }): this.setState({ runnable: false });
    }
  }

  mapLoaded(e) {
    // this.map.addControl(new mapboxgl.FullscreenControl(), 'bottom-right'); // currently full screen hides the info panel and setting position:absolute and z-index: 10000000000 doesnt work properly
    this.map.addControl(new mapboxgl.ScaleControl());
    this.map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
    this.map.on("mousemove", this.mouseMove.bind(this));
  }

  closeSnackbar() {
    this.setState({ snackbarOpen: false });
  }

  setVerbosity(value) {
    this.verbosity = value;
  }

  validateUser(user) {
    //set the state that we are validating the user
    this.setState({ validatingUser: true });
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
    this.setState({ validatingUser: false });
    //the user already exists
    if (response.users.indexOf(this.userToValidate) > -1) {
      //user validated
      this.setState({ validUser: true });
    }
    else {
      //user not validated
      this.setState({ validUser: false });
    }
  }

  login(user) {
    this.setState({ user: user, loggingIn: true });
  }

  logout() {
    this.setState({ user: 'logged out', validUser: undefined, scenario: '', scenarios: [] });
  }

  getUsersLastScenario() {
    jsonp(MARXAN_ENDPOINT + "getUser?user=" + this.state.user, this.parseGetUsersLastScenarioResponse.bind(this));
  }

  parseGetUsersLastScenarioResponse(err, response) {
    if (response.error === undefined) {
      this.setState({ scenario: response.lastScenario });
      this.loadScenario(response.lastScenario);
    }
    else {
      //ui feedback
      this.setState({ snackbarOpen: true, snackbarMessage: response.error });
    }
  }

  loadScenario(scenario) {
    this.setState({ loadingScenario: true });
    jsonp(MARXAN_ENDPOINT + "getScenario?user=" + this.state.user + "&scenario=" + scenario, this.parseLoadScenarioResponse.bind(this));
  }

  parseLoadScenarioResponse(err, response) {
    this.setState({ loadingScenario: false, loggingIn: false });
    if (response.error === undefined) {
      this.setState({ scenario: response.scenario, runParams: response.runParameters, files: Object.assign(response.files), metadata: response.metadata });
      if (response.metadata.MAPID) {
        this.changeTileset(response.metadata.MAPID);
      }
    }
    else {
      //ui feedback
      this.setState({ snackbarOpen: true, snackbarMessage: response.error });
    }
  }

  //called after a file has been uploaded
  fileUploaded(parameter, filename) {
    let newFiles = Object.assign({}, this.state.files); //creating copy of object
    newFiles[parameter] = filename; //updating value
    this.setState({ files: newFiles });
  }

  //create a new user on the server
  createNewUser(user) {
    this.setState({ validatingUser: true });
    jsonp(MARXAN_ENDPOINT + "createUser?user=" + user, this.parseCreateNewUserResponse.bind(this));
  }

  parseCreateNewUserResponse(err, response) {
    this.setState({ validatingUser: false });
    if (response.error === undefined) {
      this.setState({ validUser: true, snackbarOpen: true, snackbarMessage: response.info });
    }
    else {
      this.setState({ validUser: false, snackbarOpen: true, snackbarMessage: response.error });
    }
  }

  createNewScenario(scenario) {
    this.setState({ loadingScenarios: true });
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
      this.setState({ snackbarOpen: true, snackbarMessage: response.info });
    }
    else {
      //ui feedback
      this.setState({ snackbarOpen: true, snackbarMessage: response.error, loadingScenarios: false });
    }
  }

  deleteScenario(name) {
    this.setState({ loadingScenarios: true });
    jsonp(MARXAN_ENDPOINT + "deleteScenario?user=" + this.state.user + "&scenario=" + name, this.parseDeleteScenarioResponse.bind(this));
  }

  parseDeleteScenarioResponse(err, response) {
    if (response.error === undefined) {
      //refresh the scenarios list
      this.listScenarios();
      //ui feedback
      this.setState({ snackbarOpen: true, snackbarMessage: response.info });
      //see if the user deleted the current scenario
      if (response.scenario === this.state.scenario) {
        //ui feedback
        this.setState({ snackbarOpen: true, snackbarMessage: "Current scenario deleted - loading next available" });
        this.state.scenarios.map((scenario) => { if (scenario.name !== this.state.scenario) this.loadScenario(scenario.name) });
      }
    }
    else {
      //ui feedback
      this.setState({ snackbarOpen: true, snackbarMessage: response.error, loadingScenarios: false });
    }
  }

  startEditingScenarioName() {
    this.setState({ editingScenarioName: true });
  }
  renameScenario(newName) {
    this.setState({ editingScenarioName: false });
    if (newName !== '' && newName !== this.state.scenario) {
      jsonp(MARXAN_ENDPOINT + "renameScenario?user=" + this.state.user + "&scenario=" + this.state.scenario + "&newName=" + newName, this.parseRenameScenarioResponse.bind(this));
    }
  }

  parseRenameScenarioResponse(err, response) {
    if (response.error === undefined) {
      this.setState({ scenario: response.scenario, snackbarOpen: true, snackbarMessage: response.info });
    }
    else {
      //ui feedback
      this.setState({ snackbarOpen: true, snackbarMessage: response.error });
    }
  }

  //updates a parameter in the input.dat file directly, e.g. for updating the MAPID after the user sets their source spatial data
  updateParameter(parameter, value) {
    jsonp(MARXAN_ENDPOINT + "updateParameter?user=" + this.state.user + "&scenario=" + this.state.scenario + "&parameter=" + parameter + "&value=" + value, this.parseUpdateParameterResponse.bind(this));
  }
  parseUpdateParameterResponse(err, response) {
    if (response.error === undefined) {}
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
    this.setState({ loadingScenarios: true });
    jsonp(MARXAN_ENDPOINT + "listScenarios?user=" + this.state.user, this.parseListScenariosResponse.bind(this));
  }

  parseListScenariosResponse(err, response) {
    this.setState({ loadingScenarios: false });
    if (response.error === undefined) {
      this.setState({ scenarios: response.scenarios });
    }
    else {
      this.setState({ scenarios: undefined });
    }
  }

  setPaintProperty(expression){
    //get the name of the render layer
    let layer = this.map.getStyle().layers[this.map.getStyle().layers.length - 1];
    this.map.setPaintProperty(layer.id, "fill-color", expression);
  }

  //renders the sum of solutions
  renderSumSolutionMap(data) {
    // Calculate color for each planning unit based on the total number of selections in the marxan runs
    var expression = ["match", ["get", "PUID"]];
    data.forEach(function(row) {
      // var green = (row["number"] / NUMBER_OF_RUNS) * 255;
      // var color = "rgba(" + 0 + ", " + green + ", " + 0 + ", 1)";
      var color = "rgba(255, 0, 136," + (row["number"] / NUMBER_OF_RUNS) + ")";
      expression.push(row["planning_unit"], color);
    });
    // Last value is the default, used where there is no data
    expression.push("rgba(0,0,0,0)");
    //set the render paint property
    this.setPaintProperty(expression);
  }

  //renders a specific solutions data
  renderSolution(data) {
    // Calculate color for each planning unit 
    var expression = ["match", ["get", "PUID"]];
    data.forEach(function(row) {
      var color = "rgba(255,0,136, " + row["solution"] + ")"; //1's are pink and 0's are transparent
      expression.push(row["planning_unit"], color);
    });
    // Last value is the default, used where there is no data
    expression.push("rgba(0,0,0,0)");
    //set the render paint property
    this.setPaintProperty(expression);
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
    //save the name of the layer in the input.dat file in the MAPID parameter
    this.updateParameter("MAPID", tileset.id);
    //remove the existing spatial layer
    this.removeSpatialLayer();
    //add in the new one
    this.addSpatialLayer(tileset);
    //zoom to the layers extent
    this.zoomToBounds(tileset.bounds);
    //set the state
    this.setState({ tileset: tileset });
  }

  removeSpatialLayer() {
    let layers = this.map.getStyle().layers;
    let layerId = layers[layers.length - 1].id;
    let sourceId = layers[layers.length - 1].source;
    //remove the layer
    this.map.removeLayer(layerId);
    //remove the source if it is not a mapbox one
    if (sourceId !== "composite") this.map.removeSource(sourceId);
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
    this.map.fitBounds([minLng, minLat, maxLng, maxLat], {padding: { top: 10, bottom: 10, left: 10, right: 10 },easing: function(num){return 1;}}  );
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
            runnable={this.state.runnable}
            spatialLayerChanged={this.spatialLayerChanged.bind(this)}
            createNewScenario={this.createNewScenario.bind(this)}
            deleteScenario={this.deleteScenario.bind(this)}
            loadScenario={this.loadScenario.bind(this)}
            renameScenario={this.renameScenario.bind(this)}
            startEditingScenarioName={this.startEditingScenarioName.bind(this)}
            editingScenarioName={this.state.editingScenarioName}
            loadingScenarios={this.state.loadingScenarios}
            loadingScenario={this.state.loadingScenario}
            tilesets={this.state.tilesets}
            changeTileset={this.changeTileset.bind(this)}
            tilesetid={this.state.tilesetid}
            />
          <div className="runningSpinner"><FontAwesome spin name='sync' size='2x' style={{'display': (this.state.running ? 'block' : 'none')}}/></div>
          <Popup active_pu={this.state.active_pu} xy={this.state.popup_point}/>
          <Login open={this.state.validUser !== true || this.state.loggingIn} validatingUser={this.state.validatingUser} validateUser={this.validateUser.bind(this)} validUser={this.state.validUser} login={this.login.bind(this)} loggingIn={this.state.loggingIn} createNewUser={this.createNewUser.bind(this)} logout={this.logout.bind(this)}/>
          <Snackbar
            open={this.state.snackbarOpen}
            message={this.state.snackbarMessage}
            onRequestClose={this.closeSnackbar.bind(this)}
          />
        </React.Fragment>
      </MuiThemeProvider>
    );
  }
}

export default App;
