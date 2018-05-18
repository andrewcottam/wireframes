/*global fetch*/
import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import * as jsonp from 'jsonp';
import InfoPanel from './InfoPanel.js';
import Popup from './Popup.js';
import Login from './login.js';
import ProgressDialog from './ProgressDialog.js';
import Snackbar from 'material-ui/Snackbar';
import MapboxClient from 'mapbox';
import FontAwesome from 'react-fontawesome';
import classyBrew from 'classybrew';
/*eslint-disable no-unused-vars*/
import axios, { post } from 'axios';
/*eslint-enable no-unused-vars*/
import * as utilities from './utilities.js';

//CONSTANTS
//THE MARXAN_ENDPOINT MUST ALSO BE CHANGED IN THE FILEUPLOAD.JS FILE
let MARXAN_ENDPOINT = "https://db-server-blishten.c9users.io/marxan/webAPI2.py/";
let TIMEOUT = 0; //disable timeout setting
mapboxgl.accessToken = 'pk.eyJ1IjoiYmxpc2h0ZW4iLCJhIjoiMEZrNzFqRSJ9.0QBRA2HxTb8YHErUFRMPZg'; //this is my public access token for using in the Mapbox GL client - TODO change this to the logged in users public access token

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user: '',
      password: '',
      userData: {},
      loggingIn: false,
      loggedIn: false,
      scenario: '',
      metadata: {},
      renderer: {},
      editingScenarioName: false,
      editingDescription: false,
      runParams: [],
      files: {},
      running: false,
      runnable: false,
      runsCompleted: 0,
      numReps: 0,
      active_pu: undefined,
      log: 'No data',
      dataAvailable: false,
      outputsTabString: 'No data',
      popup_point: { x: 0, y: 0 },
      snackbarOpen: false,
      snackbarMessage: '',
      tilesets: [],
      parametersDialogOpen: false,
      updatingRunParameters: false,
      optionsDialogOpen: false,
      savingOptions: false,
      dataBreaks: []
    };
  }

  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      // style: 'mapbox://styles/blishten/cj6q75jcd39gq2rqm1d7yv5rc', //north star
      style: 'mapbox://styles/blishten/cjg6jk8vg3tir2spd2eatu5fd', //north star + marine PAs in pacific
      // center: [0.043476868184143314, 0.0460817578557311],
      center: [0, 0],
      zoom: 2
    });
    this.map.on("load", this.mapLoaded.bind(this));
    //instantiate the classybrew to get the color ramps for the renderers
    this.setState({ brew: new classyBrew() });
  }

  componentDidUpdate(prevProps, prevState) {
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

  //checks the response from a REST call for timeout errors or empty responses
  responseIsTimeoutOrEmpty(err, response) {
    if (err || !response) {
      let msg = err ? err.message : "No response received from server";
      this.setState({ snackbarOpen: true, snackbarMessage: msg, loggingIn: false });
      return true;
    }
    else {
      return false;
    }
  }

  //checks to see if the rest server raised an error and if it did then show in the snackbar
  isServerError(response) {
    if (response.error) {
      this.setState({ snackbarOpen: true, snackbarMessage: response.error });
      return true;
    }
    else {
      return false;
    }
  }

  changeUserName(user) {
    this.setState({ user: user });
  }

  changePassword(password) {
    this.setState({ password: password });
  }

  validateUser() {
    this.setState({ loggingIn: true });
    //get a list of existing users 
    jsonp(MARXAN_ENDPOINT + "validateUser?user=" + this.state.user + "&password=" + this.state.password, { timeout: TIMEOUT }, this.parseValidateUserResponse.bind(this));
  }

  parseValidateUserResponse(err, response) {
    //check if there are no timeout errors or empty responses
    if (!this.responseIsTimeoutOrEmpty(err, response)) {
      //check there are no errors from the server
      if (!this.isServerError(response)) {
        //user validated - log them in
        this.login();
      }
      else {
        this.setState({ loggingIn: false });
      }
    }
  }

  getUsers() {
    //Get a user list
    jsonp(MARXAN_ENDPOINT + "listUsers", { timeout: TIMEOUT }, this.parseGetUsersResponse.bind(this));
  }

  parseGetUsersResponse(err, response) {
    //check if there are no timeout errors or empty responses
    if (!this.responseIsTimeoutOrEmpty(err, response)) {
      //the user already exists
      if (response.users.indexOf(this.state.user) > -1) {
        //user validated - log them in
        this.login();
      }
      else {
        //ui feedback
        this.setState({ loggingIn: false, snackbarOpen: true, snackbarMessage: "Invalid login" });
      }
    }
  }

  //the user is validated so login
  login() {
    //get the users data
    this.getUserInfo();
  }

  //log out and reset some state 
  logout() {
    this.setState({ loggedIn: false, user: '', password: '', scenario: '' });
  }

  resendPassword() {
    this.setState({ resending: true });
    jsonp(MARXAN_ENDPOINT + "resendPassword?user=" + this.state.user, { timeout: TIMEOUT }, this.parseResendPasswordResponse.bind(this));
  }

  //callback function after resending the users password
  parseResendPasswordResponse(err, response) {
    this.setState({ resending: false });
    //check if there are no timeout errors or empty responses
    if (!this.responseIsTimeoutOrEmpty(err, response)) {
      //check there are no errors from the server
      if (!this.isServerError(response)) {
        this.setState({ snackbarOpen: true, snackbarMessage: "Password resent" });
      }
    }
  }

  //gets all the information for the user that is logging in
  getUserInfo() {
    jsonp(MARXAN_ENDPOINT + "getUser?user=" + this.state.user, { timeout: TIMEOUT }, this.parseGetUserInfoResponse.bind(this));
  }

  //callback function to get the information for the user that is logging in
  parseGetUserInfoResponse(err, response) {
    //check if there are no timeout errors or empty responses
    if (!this.responseIsTimeoutOrEmpty(err, response)) {
      //check there are no errors from the server
      if (!this.isServerError(response)) {
        this.setState({ scenario: response.userData.LASTSCENARIO, userData: response.userData });
        //get the users tilesets from mapbox
        this.getTilesets();
      }
    }
  }

  appendToFormData(formData, obj) {
    //iterate through the object and add each key/value pair to the formData to post to the server
    for (var key in obj) {
      //only add non-prototype objects
      if (obj.hasOwnProperty(key)) {
        formData.append(key, obj[key]);
      }
    }
    return formData;
  }

  //removes the keys from the object
  removeKeys(obj, keys) {
    keys.map(function(key) {
      delete obj[key];
    });
    return obj;
  }

  //updates all parameter in the user.dat file then updates the state (in userData)
  updateUser(parameters) {
    //ui feedback
    this.setState({ savingOptions: true });
    //remove the keys that are not part of the users information
    parameters = this.removeKeys(parameters, ["updated", "validEmail"]);
    //initialise the form data
    let formData = new FormData();
    //add the current user
    formData.append("user", this.state.user);
    //append all the key/value pairs
    this.appendToFormData(formData, parameters);
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    };
    //post to the server
    post(MARXAN_ENDPOINT + "updateUser", formData, config).then((response) => this.parseUpdateUserParametersResponse(response.data));
    //update the state
    this.newUserData = Object.assign(this.state.userData, parameters);
  }

  //callback function after updating the user.dat file with the passed parameters
  parseUpdateUserParametersResponse(response) {
    //check if there are no timeout errors or empty responses
    if (!this.responseIsTimeoutOrEmpty(undefined, response)) {
      //check there are no errors from the server
      if (!this.isServerError(response)) {
        //if succesfull write the state back to the userData key
        this.setState({ snackbarOpen: true, snackbarMessage: response.info, userData: this.newUserData, savingOptions: false, optionsDialogOpen: false });
      }
    }
  }
  //opens the options parameters dialog whos open state is controlled
  openOptionsDialog() {
    this.setState({ optionsDialogOpen: true });
  }
  //closes the options parameters dialog whos open state is controlled
  closeOptionsDialog() {
    this.setState({ optionsDialogOpen: false });
  }

  //saveOptions - the options are in the users data so we use the updateUser REST call to update them
  saveOptions(options) {
    this.updateUser(options);
  }
  //hides the popup
  hidePopup() {
    this.setState({ active_pu: undefined });
  }
  //opens the run parameters dialog whos open state is controlled
  openParametersDialog() {
    this.setState({ parametersDialogOpen: true });
  }
  //closes the run parameters dialog whos open state is controlled
  closeParametersDialog() {
    this.setState({ parametersDialogOpen: false });
  }

  //updates the parameters for the current scenario back to the server
  updateRunParams(array) {
    //ui feedback
    this.setState({ updatingRunParameters: true });
    //convert the parameters array into an object
    let parameters = {};
    array.map((obj) => { parameters[obj.key] = obj.value });
    //initialise the form data
    let formData = new FormData();
    //add the current user
    formData.append("user", this.state.user);
    //add the current scenario
    formData.append("scenario", this.state.scenario);
    //append all the key/value pairs
    this.appendToFormData(formData, parameters);
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    };
    //post to the server
    post(MARXAN_ENDPOINT + "updateRunParams", formData, config).then((response) => this.parseUpdateRunParametersResponse(response.data));
    //save the local state to be able to update the state on callback
    this.runParams = Object.assign(this.state.runParams, formData);
  }

  //callback function after updating the run parameters for this scenario
  parseUpdateRunParametersResponse(response) {
    //ui feedback
    this.setState({ updatingRunParameters: false });
    //check if there are no timeout errors or empty responses
    if (!this.responseIsTimeoutOrEmpty(undefined, response)) {
      //check there are no errors from the server
      if (!this.isServerError(response)) {
        //get the number of runs from the run parameters array
        let numReps = this.runParams.filter(function(item) { return item.key === "NUMREPS" })[0].value;
        //if succesfull write the state back 
        this.setState({ snackbarOpen: true, snackbarMessage: response.info, runParams: this.runParams, parametersDialogOpen: false, numReps: numReps });
      }
    }
  }

  //gets all of the tilesets from mapbox using the access token for the currently logged on user - this access token must have the TILESETS:LIST scope
  getTilesets() {
    //get the tilesets for the user
    let client = new MapboxClient(this.state.userData.MAPBOXACCESSTOKEN);
    client.listTilesets(this.parseTilesets.bind(this));
  }

  //callback function with the tileset info for the user
  parseTilesets(err, tilesets) {
    //check if there are no timeout errors or empty responses
    if (!this.responseIsTimeoutOrEmpty(err, tilesets)) {
      //sort alphabetically by name
      tilesets.sort(function(a, b) {
        if (a.name < b.name)
          return -1;
        if (a.name > b.name)
          return 1;
        return 0;
      });
      //set the state
      this.setState({ tilesets: tilesets });
      //now the tilesets are loaded from mapbox we can get the users last scenario and load it - this is only relevant if the user is not currently logged in - if they are logged in they are simply refreshing the list of tilesets
      if (!this.state.loggedIn) this.loadScenario(this.state.userData.LASTSCENARIO);
    }
    else {
      this.setState({ tilesets: [] });
    }
  }
  //called if the tileset select box is changed
  changeTileset(tilesetid) {
    this.getMetadata(tilesetid).then(this.metadataRetrieved.bind(this));
    this.setState({ tilesetid: tilesetid });
  }

  //gets all of the metadata for the tileset
  getMetadata(tilesetId) {
    return fetch("https://api.mapbox.com/v4/" + tilesetId + ".json?secure&access_token=" + this.state.userData.MAPBOXACCESSTOKEN)
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

  //loads a scenario
  loadScenario(scenario) {
    this.setState({ loadingScenario: true });
    //reset the results from any previous scenarios
    this.resetResults();
    jsonp(MARXAN_ENDPOINT + "getScenario?user=" + this.state.user + "&scenario=" + scenario, { timeout: TIMEOUT }, this.parseLoadScenarioResponse.bind(this));
  }

  //callback function to get the files, metadata and runparameters for a specific scenario to render in the UI
  parseLoadScenarioResponse(err, response) {
    this.setState({ loadingScenario: false, loggingIn: false });
    //check if there are no timeout errors or empty responses
    if (!this.responseIsTimeoutOrEmpty(err, response)) {
      //check there are no errors from the server
      if (!this.isServerError(response)) {
        //get the number of runs from the run parameters array
        let numReps = response.runParameters.filter(function(item) { return item.key === "NUMREPS" })[0].value;
        this.setState({ loggedIn: true, scenario: response.scenario, runParams: response.runParameters, numReps: numReps, files: Object.assign(response.files), metadata: response.metadata, renderer: response.renderer });
        //if there is a mapid passed then programmatically change the select box to this map 
        if (response.metadata.MAPID) {
          this.changeTileset(response.metadata.MAPID);
        }
        //poll the server to see if results are available for this scenario - if there are these will be loaded
        this.pollResults(true);
      }
    }
  }

  //resets various variables and state in between users
  resetResults() {
    this.runMarxanResponse = {};
    this.setState({ log: 'No data', solutions: [], dataAvailable: false, outputsTabString: 'No data' });
  }

  //called after a file has been uploaded
  fileUploaded(parameter, filename) {
    let newFiles = Object.assign({}, this.state.files); //creating copy of object
    newFiles[parameter] = filename; //updating value
    this.setState({ files: newFiles });
  }

  //create a new user on the server
  createNewUser(user, password, name, email, mapboxaccesstoken) {
    this.setState({ creatingNewUser: true });
    let formData = new FormData();
    formData.append('user', user);
    formData.append('password', password);
    formData.append('name', name);
    formData.append('email', email);
    formData.append('mapboxaccesstoken', mapboxaccesstoken);
    formData.append('scenario', 'Sample scenario');
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    };
    post(MARXAN_ENDPOINT + "createUser", formData, config).then((response) => this.parseCreateNewUserResponse(response.data));
  }

  //callback function after creating a new user
  parseCreateNewUserResponse(response) {
    this.setState({ creatingNewUser: false });
    //check there are no errors from the server
    if (!this.isServerError(response)) {
      this.setState({ snackbarOpen: true, snackbarMessage: response.info + ". Close and login" });
    }
    else {
      this.setState({ snackbarOpen: true, snackbarMessage: response.error });
    }
  }

  //REST call to create a new scenario for a specific user
  createNewScenario(scenario) {
    this.setState({ loadingScenarios: true });
    if (scenario.description) {
      jsonp(MARXAN_ENDPOINT + "createScenario?user=" + this.state.user + "&scenario=" + scenario.name + "&description=" + scenario.description, { timeout: TIMEOUT }, this.parseCreateNewScenarioResponse.bind(this));
    }
    else {
      jsonp(MARXAN_ENDPOINT + "createScenario?user=" + this.state.user + "&scenario=" + scenario.name, { timeout: TIMEOUT }, this.parseCreateNewScenarioResponse.bind(this));
    }
  }

  //callback function after creating a new scenario
  parseCreateNewScenarioResponse(err, response) {
    //check if there are no timeout errors or empty responses
    if (!this.responseIsTimeoutOrEmpty(err, response)) {
      //check there are no errors from the server
      if (!this.isServerError(response)) {
        //refresh the scenarios list
        this.listScenarios();
        this.setState({ snackbarOpen: true, snackbarMessage: response.info });
      }
      else {
        //ui feedback
        this.setState({ loadingScenarios: false });
      }
    }
  }

  //REST call to delete a specific scenario
  deleteScenario(name) {
    this.setState({ loadingScenarios: true });
    jsonp(MARXAN_ENDPOINT + "deleteScenario?user=" + this.state.user + "&scenario=" + name, { timeout: TIMEOUT }, this.parseDeleteScenarioResponse.bind(this));
  }

  //callback function after deleting a specific scenario on the server
  parseDeleteScenarioResponse(err, response) {
    //check if there are no timeout errors or empty responses
    if (!this.responseIsTimeoutOrEmpty(err, response)) {
      //check there are no errors from the server
      if (!this.isServerError(response)) {
        //refresh the scenarios list
        this.listScenarios();
        //ui feedback
        this.setState({ snackbarOpen: true, snackbarMessage: response.info });
        //see if the user deleted the current scenario
        if (response.scenario === this.state.scenario) {
          //ui feedback
          this.setState({ snackbarOpen: true, snackbarMessage: "Current scenario deleted - loading next available" });
          this.state.scenarios.map((scenario) => { if (scenario.name !== this.state.scenario) this.loadScenario(scenario.name); return undefined; });
        }
      }
      else {
        //ui feedback
        this.setState({ loadingScenarios: false });
      }
    }
  }

  startEditingScenarioName() {
    this.setState({ editingScenarioName: true });
  }

  startEditingDescription() {
    this.setState({ editingDescription: true });
  }
  //REST call to rename a specific scenario on the server
  renameScenario(newName) {
    this.setState({ editingScenarioName: false });
    if (newName !== '' && newName !== this.state.scenario) {
      jsonp(MARXAN_ENDPOINT + "renameScenario?user=" + this.state.user + "&scenario=" + this.state.scenario + "&newName=" + newName, { timeout: TIMEOUT }, this.parseRenameScenarioResponse.bind(this));
    }
  }

  parseRenameScenarioResponse(err, response) {
    //check if there are no timeout errors or empty responses
    if (!this.responseIsTimeoutOrEmpty(err, response)) {
      //check there are no errors from the server
      if (!this.isServerError(response)) {
        this.setState({ scenario: response.scenario, snackbarOpen: true, snackbarMessage: response.info });
      }
    }
  }

  renameDescription(newDesc) {
    this.setState({ editingDescription: false });
    if (newDesc !== '' && newDesc !== this.state.metadata.DESCRIPTION) {
      jsonp(MARXAN_ENDPOINT + "renameDescription?user=" + this.state.user + "&scenario=" + this.state.scenario + "&newDesc=" + newDesc, { timeout: TIMEOUT }, this.parseRenameDescriptionResponse.bind(this));
    }

  }
  parseRenameDescriptionResponse(err, response) {
    //check if there are no timeout errors or empty responses
    if (!this.responseIsTimeoutOrEmpty(err, response)) {
      //check there are no errors from the server
      if (!this.isServerError(response)) {
        this.setState({ metadata: Object.assign(this.state.metadata, { DESCRIPTION: response.description }), snackbarOpen: true, snackbarMessage: response.info });
      }
    }
  }

  listScenarios() {
    this.setState({ loadingScenarios: true });
    jsonp(MARXAN_ENDPOINT + "listScenarios?user=" + this.state.user, { timeout: TIMEOUT }, this.parseListScenariosResponse.bind(this));
  }

  parseListScenariosResponse(err, response) {
    this.setState({ loadingScenarios: false });
    //check if there are no timeout errors or empty responses
    if (!this.responseIsTimeoutOrEmpty(err, response)) {
      //check there are no errors from the server
      if (!this.isServerError(response)) {
        this.setState({ scenarios: response.scenarios });
      }
      else {
        this.setState({ scenarios: undefined });
      }
    }
  }

  //updates a parameter in the input.dat file directly, e.g. for updating the MAPID after the user sets their source spatial data
  updateParameter(parameter, value) {
    jsonp(MARXAN_ENDPOINT + "updateParameter?user=" + this.state.user + "&scenario=" + this.state.scenario + "&parameter=" + parameter + "&value=" + value, { timeout: TIMEOUT }, this.parseUpdateParameterResponse.bind(this));
  }
  parseUpdateParameterResponse(err, response) {
    //check if there are no timeout errors or empty responses
    if (!this.responseIsTimeoutOrEmpty(err, response)) {
      //check there are no errors from the server
      if (!this.isServerError(response)) {
        //do something
      }
    }
  }

  //run a marxan job on the server
  runMarxan(e) {
    //update the ui to reflect the fact that a job is running
    this.setState({ running: true, log: 'Running...', active_pu: undefined, outputsTabString: 'Running...' });
    //make the request to get the marxan data
    jsonp(MARXAN_ENDPOINT + "runMarxan?user=" + this.state.user + "&scenario=" + this.state.scenario);
    this.timer = setInterval(() => this.pollResults(false), 3000);
  }

  //poll the server to see if the run has completed
  pollResults(checkForExistingRun) {
    //make the request to get the marxan data
    jsonp(MARXAN_ENDPOINT + "pollResults?user=" + this.state.user + "&scenario=" + this.state.scenario + "&numreps=" + this.state.numReps + "&checkForExistingRun=" + checkForExistingRun, { timeout: TIMEOUT }, this.parsePollResultsResponse.bind(this));
  }

  parsePollResultsResponse(err, response) {
    //check if there are no timeout errors from the server or empty responses from the server
    if (!this.responseIsTimeoutOrEmpty(err, response)) {
      //check there are no errors from the server from my code
      if (!this.isServerError(response)) {
        //the response includes the summed solution so it has finished
        if (response.ssoln) {
          this.runCompleted(response);
          //cancel the timer which polls the server to see when the run is complete
          clearInterval(this.timer);
        }
        else {
          this.setState({ runsCompleted: response.runsCompleted });
        }
      }
      else {
        this.setState({ running: false });
      }
    }
  }

  //run completed
  runCompleted(response) {
    //get the response and store it in this component
    this.runMarxanResponse = response;
    //if we have some data to map then set the state to reflect this
    (this.runMarxanResponse.ssoln) ? this.setState({ dataAvailable: true }): this.setState({ dataAvailable: false });
    //render the sum solution map
    this.renderSolution(this.runMarxanResponse.ssoln, true);
    //create the array of solutions to pass to the InfoPanels table
    let solutions = response.sum;
    //the array data are in the format "Run_Number","Score","Cost","Planning_Units" - so create an array of objects to pass to the outputs table
    solutions = solutions.map(function(item) {
      return { "Run_Number": item[0], "Score": item[1], "Cost": item[2], "Planning_Units": item[3] };
    });
    //add in the row for the summed solutions
    solutions.splice(0, 0, { 'Run_Number': 'Sum', 'Score': '', 'Cost': '', 'Planning_Units': '' });
    //ui feedback
    this.setState({ running: false, runsCompleted: 0, log: response.log.replace(/(\r\n|\n|\r)/g, "<br />"), outputsTabString: '', solutions: solutions, snackbarOpen: true, snackbarMessage: response.info });
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
      this.renderSolution(this.runMarxanResponse.ssoln, true);
    }
    else {
      //request the data for the specific solution
      jsonp(MARXAN_ENDPOINT + "loadSolution?user=" + this.state.user + "&scenario=" + this.state.scenario + "&solution=" + solution, { timeout: TIMEOUT }, this.parseLoadSolutionResponse.bind(this));
    }
  }

  parseLoadSolutionResponse(err, response) {
    //check if there are no timeout errors or empty responses
    if (!this.responseIsTimeoutOrEmpty(err, response)) {
      //check there are no errors from the server
      if (!this.isServerError(response)) {
        this.renderSolution(response.solution, false);
      }
    }
  }

  setPaintProperty(expression) {
    //get the name of the render layer
    if (this.state.marxanLayer) {
      this.map.setPaintProperty(this.state.marxanLayer.id, "fill-color", expression);
      this.map.setPaintProperty(this.state.marxanLayer.id, "fill-opacity", 0.6);
      // this.map.setPaintProperty(this.state.marxanLayer.id, "fill-outline-color", "#888888");
    }
  }

  //gets the total number of planning units in the ssoln and outputs the statistics of the distribution to state, e.g. 2 PUs with a value of 1, 3 with a value of 2 etc.
  getssolncount(data) {
    let total = 0;
    let summaryStats = [];
    data.map(function(item) {
      summaryStats.push({ number: item[0], count: item[1].length });
      total += item[1].length;
    });
    this.setState({ summaryStats: summaryStats });
    return total;
  }
  //gets a sample of the data to be able to do a classification, e.g. natural breaks, jenks etc.
  getssolnSample(data, sampleSize) {
    let sample = [],
      num = 0;
    let ssolnLength = this.getssolncount(data);
    data.map(function(item) {
      num = Math.floor((item[1].length / ssolnLength) * sampleSize);
      sample.push(Array(num, ).fill(item[0]));
    });
    return [].concat.apply([], sample);
  }

  //gets the classification and colorbrewer object for doing the rendering
  classifyData(data, numClasses, colorCode, classification) {
    //get a sample of the data to make the renderer classification
    let sample = this.getssolnSample(data, 1000);
    //set the data 
    this.state.brew.setSeries(sample);
    //set the color code - see the color theory section on Joshua Tanners page here https://github.com/tannerjt/classybrew - for all the available colour codes
    this.state.brew.setColorCode(colorCode);
    //get the maximum number of colors in this scheme
    let colorSchemeLength = utilities.getMaxNumberOfClasses(this.state.brew, colorCode);
    //check the color scheme supports the passed number of classes
    if (numClasses > colorSchemeLength) {
      //set the numClasses to the max for the color scheme
      numClasses = colorSchemeLength;
      //reset the renderer
      this.setState({ renderer: Object.assign(this.state.renderer, { NUMCLASSES: numClasses }) });
    }
    //set the number of classes
    this.state.brew.setNumClasses(numClasses);
    //if the colorCode is opacity then I will add it manually to the classbrew colorSchemes
    if (colorCode === 'opacity') {
      // expression.push(row[1], "rgba(255, 0, 136," + (row[0] / this.state.runParams.NUMREPS) + ")");
      let newBrewColorScheme = Array(Number(this.state.renderer.NUMCLASSES)).fill("rgba(255,0,136,").map(function(item, index) { return item + ((1 / this) * (index + 1)) + ")"; }, this.state.renderer.NUMCLASSES);
      this.state.brew.colorSchemes.opacity = {
        [this.state.renderer.NUMCLASSES]: newBrewColorScheme
      };
    }
    //set the classification method - one of equal_interval, quantile, std_deviation, jenks (default)
    this.state.brew.classify(classification);
    this.setState({ dataBreaks: this.state.brew.getBreaks() });
  }

  //called when the renderer state has been updated - renders the solution and saves the renderer back to the server
  rendererStateUpdated(parameter, value) {
    this.renderSolution(this.runMarxanResponse.ssoln, true);
    this.updateParameter(parameter, value);
  }
  //change the renderer, e.g. jenks, natural_breaks etc.
  changeRenderer(renderer) {
    this.setState({ renderer: Object.assign(this.state.renderer, { CLASSIFICATION: renderer }) }, function() {
      this.rendererStateUpdated("CLASSIFICATION", renderer);
    });
  }
  //change the number of classes of the renderer
  changeNumClasses(numClasses) {
    this.setState({ renderer: Object.assign(this.state.renderer, { NUMCLASSES: numClasses }) }, function() {
      this.rendererStateUpdated("NUMCLASSES", numClasses);
    });
  }
  //change the color code of the renderer
  changeColorCode(colorCode) {
    //set the maximum number of classes that can be selected in the other select boxes
    if (this.state.renderer.NUMCLASSES > this.state.brew.getNumClasses()) {
      this.setState({ renderer: Object.assign(this.state.renderer, { NUMCLASSES: this.state.brew.getNumClasses() }) });
    }
    this.setState({ renderer: Object.assign(this.state.renderer, { COLORCODE: colorCode }) }, function() {
      this.rendererStateUpdated("COLORCODE", colorCode);
    });
  }
  //change how many of the top classes only to show
  changeShowTopClasses(numClasses) {
    this.setState({ renderer: Object.assign(this.state.renderer, { TOPCLASSES: numClasses }) }, function() {
      this.rendererStateUpdated("TOPCLASSES", numClasses);
    });
  }
  //renders the solution - data is the REST response and sum is a flag to indicate if the data is the summed solution (true) or an individual solution (false)
  renderSolution(data, sum) {
    if (!data) return;
    var color, visibleValue, value;
    //create the renderer using Joshua Tanners excellent library classybrew - available here https://github.com/tannerjt/classybrew
    this.classifyData(data, Number(this.state.renderer.NUMCLASSES), this.state.renderer.COLORCODE, this.state.renderer.CLASSIFICATION);
    //build an expression to get the matching puids with different numbers of 'numbers' in the marxan results
    var expression = ["match", ["get", "PUID"]];
    //if only the top n classes will be rendered then get the visible value at the boundary
    if (this.state.renderer.TOPCLASSES < this.state.renderer.NUMCLASSES) {
      let breaks = this.state.brew.getBreaks();
      visibleValue = breaks[this.state.renderer.NUMCLASSES - this.state.renderer.TOPCLASSES + 1];
    }
    else {
      visibleValue = 0;
    }
    // the rest service sends the data grouped by the 'number', e.g. [23,34,36,43,98], 2
    data.forEach(function(row, index) {
      if (sum) {
        value = row[0];
        //for each row add the puids and the color to the expression, e.g. [35,36,37],"rgba(255, 0, 136,0.1)"
        color = this.state.brew.getColorInRange(value);
        //add the color to the expression - transparent if the value is less than the visible value
        (value >= visibleValue) ? expression.push(row[1], color): expression.push(row[1], "rgba(0, 0, 0, 0)");
      }
      else {
        expression.push(row[1], "rgba(255, 0, 136,1)");
      }
    }, this);
    // Last value is the default, used where there is no data
    expression.push("rgba(0,0,0,0)");
    //set the render paint property
    this.setPaintProperty(expression);
  }

  mouseMove(e) {
    //error check
    if (!this.state.userData.SHOWPOPUP || this.state.marxanLayer === undefined) return;
    //get the features under the mouse
    var features = this.map.queryRenderedFeatures(e.point);
    //see if there are any planning unit features under the mouse
    if ((features.length) && (features[0].layer.id === this.state.marxanLayer.id)) {
      //set the location for the popup
      if (!this.state.active_pu || (this.state.active_pu && this.state.active_pu.PUID !== features[0].properties.PUID)) this.setState({ popup_point: e.point });
      //get the properties from the vector tile
      let vector_tile_properties = features[0].properties;
      //get the properties from the marxan results - these will include the number of solutions that that planning unit is found in
      let marxan_results = this.runMarxanResponse && this.runMarxanResponse.ssoln ? this.runMarxanResponse.ssoln.filter(item => item[1].indexOf(vector_tile_properties.PUID) > -1)[0] : {};
      if (marxan_results) {
        //convert the marxan results from an array to an object
        let marxan_results_dict = { "PUID": vector_tile_properties.PUID, "Number": marxan_results[0] };
        //combine the 2 sets of properties
        let active_pu = Object.assign(marxan_results_dict, vector_tile_properties);
        //set the state to re-render the popup
        this.setState({ active_pu: active_pu });
      }
      else {
        this.hidePopup();
      }
    }
    else {
      this.hidePopup();
    }
  }

  hidePopup() {
    this.setState({ active_pu: undefined });
  }

  spatialLayerChanged(tileset, zoomToBounds) {
    //save the name of the layer in the input.dat file in the MAPID parameter
    this.updateParameter("MAPID", tileset.id);
    //remove the existing spatial layer
    this.removeSpatialLayer();
    //add in the new one
    this.addSpatialLayer(tileset);
    //set the state for the marxan layer
    let marxanLayer = this.map.getStyle().layers[this.map.getStyle().layers.length - 1];
    this.setState({ marxanLayer: marxanLayer });
    //zoom to the layers extent
    this.zoomToBounds(tileset.bounds);
    //set the state
    this.setState({ tileset: tileset });
  }

  removeSpatialLayer() {
    let layers = this.map.getStyle().layers;
    let layerId = layers[layers.length - 1].id;
    let sourceId = layers[layers.length - 1].source;
    //remove the layer and source if it is not from the mapbox map, i.e. added manually in spatialLayerChanged
    if (sourceId !== "composite") {
      this.map.removeLayer(layerId);
      this.map.removeSource(sourceId);
    }
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
    this.map.fitBounds([minLng, minLat, maxLng, maxLat], { padding: { top: 10, bottom: 10, left: 10, right: 10 }, easing: function(num) { return 1; } });
  }

  render() {
    return (
      <MuiThemeProvider>
        <React.Fragment>
          <div ref={el => this.mapContainer = el} className="absolute top right left bottom" />
          <InfoPanel
            user={this.state.user}
            userData={this.state.userData}
            loggedIn={this.state.loggedIn}
            listScenarios={this.listScenarios.bind(this)}
            scenarios={this.state.scenarios}
            scenario={this.state.scenario}
            metadata={this.state.metadata}
            renderer={this.state.renderer}
            logout={this.logout.bind(this)}
            runParams={this.state.runParams} 
            files={this.state.files}
            fileUploaded={this.fileUploaded.bind(this)}
            runMarxan={this.runMarxan.bind(this)} 
            loadSolution={this.loadSolution.bind(this)} 
            running={this.state.running} 
            outputsTabString={this.state.outputsTabString} 
            dataAvailable={this.state.dataAvailable} 
            solutions={this.state.solutions}
            log={this.state.log} 
            runnable={this.state.runnable}
            spatialLayerChanged={this.spatialLayerChanged.bind(this)}
            createNewScenario={this.createNewScenario.bind(this)}
            deleteScenario={this.deleteScenario.bind(this)}
            loadScenario={this.loadScenario.bind(this)}
            renameScenario={this.renameScenario.bind(this)}
            renameDescription={this.renameDescription.bind(this)}
            startEditingScenarioName={this.startEditingScenarioName.bind(this)}
            startEditingDescription={this.startEditingDescription.bind(this)}
            editingScenarioName={this.state.editingScenarioName}
            editingDescription={this.state.editingDescription}
            loadingScenarios={this.state.loadingScenarios}
            loadingScenario={this.state.loadingScenario}
            tilesets={this.state.tilesets}
            changeTileset={this.changeTileset.bind(this)}
            tilesetid={this.state.tilesetid}
            saveOptions={this.saveOptions.bind(this)}
            savingOptions={this.state.savingOptions}
            optionsDialogOpen={this.state.optionsDialogOpen}
            openOptionsDialog={this.openOptionsDialog.bind(this)}
            closeOptionsDialog={this.closeOptionsDialog.bind(this)}
            hidePopup={this.hidePopup.bind(this)}
            updateUser={this.updateUser.bind(this)}
            updateRunParams={this.updateRunParams.bind(this)}
            openParametersDialog={this.openParametersDialog.bind(this)}
            closeParametersDialog={this.closeParametersDialog.bind(this)}
            parametersDialogOpen={this.state.parametersDialogOpen}
            updatingRunParameters={this.state.updatingRunParameters}
            changeRenderer={this.changeRenderer.bind(this)}
            changeNumClasses={this.changeNumClasses.bind(this)}
            changeColorCode={this.changeColorCode.bind(this)}
            changeShowTopClasses={this.changeShowTopClasses.bind(this)}
            summaryStats={this.state.summaryStats}
            brew={this.state.brew}
            dataBreaks={this.state.dataBreaks}
            />
          <div className="runningSpinner"><FontAwesome spin name='sync' size='2x' style={{'display': (this.state.running ? 'block' : 'none')}}/></div>
          <Popup
            active_pu={this.state.active_pu} 
            xy={this.state.popup_point}
          />
          <Login open={!this.state.loggedIn} 
            changeUserName={this.changeUserName.bind(this)} 
            changePassword={this.changePassword.bind(this)} 
            user={this.state.user} 
            password={this.state.password} 
            validateUser={this.validateUser.bind(this)} 
            loggingIn={this.state.loggingIn} 
            createNewUser={this.createNewUser.bind(this)}
            creatingNewUser={this.state.creatingNewUser}
            resendPassword={this.resendPassword.bind(this)}
            resending={this.state.resending}
          />
          <Snackbar
            open={this.state.snackbarOpen}
            message={this.state.snackbarMessage}
            onRequestClose={this.closeSnackbar.bind(this)}
          />
          <ProgressDialog 
            open={this.state.running}
            numReps={this.state.numReps}
            runsCompleted={this.state.runsCompleted}
          />
        </React.Fragment>
      </MuiThemeProvider>
    );
  }
}

export default App;
