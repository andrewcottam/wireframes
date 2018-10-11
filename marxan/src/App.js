/*global fetch*/
import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import * as jsonp from 'jsonp-promise';
import InfoPanel from './InfoPanel.js';
import Popup from './Popup.js';
import Login from './login.js';
import RunProgressDialog from './RunProgressDialog.js';
import Snackbar from 'material-ui/Snackbar';
import MapboxClient from 'mapbox';
import classyBrew from 'classybrew';
/*eslint-disable no-unused-vars*/
import axios, { post } from 'axios';
/*eslint-enable no-unused-vars*/
import * as utilities from './utilities.js';
import NewCaseStudyDialog from './NewCaseStudyDialog.js';
import NewPlanningUnitDialog from './newCaseStudySteps/NewPlanningUnitDialog';
import NewInterestFeatureDialog from './newCaseStudySteps/NewInterestFeatureDialog';
import AllInterestFeaturesDialog from './AllInterestFeaturesDialog';
import AllCostsDialog from './AllCostsDialog';
import SettingsDialog from './SettingsDialog';
import FilesDialog from './FilesDialog';
import ResultsPane from './ResultsPane';
import ClassificationDialog from './ClassificationDialog';
import ImportWizard from './ImportWizard';
import FlatButton from 'material-ui/FlatButton';
import { white } from 'material-ui/styles/colors';
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back';

//CONSTANTS
//THE MARXAN_ENDPOINT MUST ALSO BE CHANGED IN THE FILEUPLOAD.JS FILE 
let MARXAN_ENDPOINT = "https://db-server-blishten.c9users.io/marxan/webAPI.py/";
let REST_ENDPOINT = "https://db-server-blishten.c9users.io/cgi-bin/services.py/biopama/marxan/";
let TIMEOUT = 0; //disable timeout setting
let DISABLE_LOGIN = true; //to not show the login form, set loggedIn to true
let MAPBOX_USER = "blishten";
mapboxgl.accessToken = 'pk.eyJ1IjoiYmxpc2h0ZW4iLCJhIjoiMEZrNzFqRSJ9.0QBRA2HxTb8YHErUFRMPZg'; //this is my public access token for using in the Mapbox GL client - TODO change this to the logged in users public access token

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user: DISABLE_LOGIN ? 'andrew' : '',
      password: DISABLE_LOGIN ? 'asd' : '',
      scenario: DISABLE_LOGIN ? 'Tonga marine' : '',
      loggedIn: false,
      userData: {},
      loggingIn: false,
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
      filesDialogOpen: false,
      updatingRunParameters: false,
      optionsDialogOpen: false,
      newCaseStudyDialogOpen: false, //set to true to debug immediately
      NewPlanningUnitDialogOpen: false, //set to true to debug immediately
      NewInterestFeatureDialogOpen: false,
      AllInterestFeaturesDialogOpen: false,
      AllCostsDialogOpen: false,
      settingsDialogOpen: false,
      classificationDialogOpen: false,
      importDialogOpen: false,
      resultsPaneOpen: true,
      preprocessingFeature: false,
      featureDatasetName: '',
      featureDatasetDescription: '',
      featureDatasetFilename: '',
      creatingNewPlanningUnit: false,
      creatingPuvsprFile: false, //true when the puvspr.dat file is being created on the server
      savingOptions: false,
      dataBreaks: [],
      planningUnitGrids: [],
      allFeatures: [], //all of the interest features in the metadata_interest_features table
      scenarioFeatures: [], //the features for the currently loaded scenario
      costs: [],
      selectedCosts: [],
      iso3: '',
      domain: '',
      areakm2: undefined,
      countries: [],
      puidsToExclude: [],
      planning_units: [],
      preprocessing: []
    };
  }

  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      // style: 'mapbox://styles/' + MAPBOX_USER + '/cj6q75jcd39gq2rqm1d7yv5rc', //north star
      style: 'mapbox://styles/' + MAPBOX_USER + '/cjg6jk8vg3tir2spd2eatu5fd', //north star + marine PAs in pacific
      // center: [0.043476868184143314, 0.0460817578557311],
      center: [0, 0],
      zoom: 2
    });
    this.map.on("load", this.mapLoaded.bind(this));
    //set a reference to this App in the map object 
    this.map.App = this;
    //instantiate the classybrew to get the color ramps for the renderers
    this.setState({ brew: new classyBrew() });
    //if disabling the login, then programatically log in
    if (DISABLE_LOGIN) this.validateUser();
  }

  componentDidUpdate(prevProps, prevState) {
    //if any files have been uploaded then check to see if we have all of the mandatory file inputs - if so, set the state to being runnable
    if (this.state.files !== prevState.files) {
      (this.state.files.SPECNAME !== '' && this.state.files.PUNAME !== '') ? this.setState({ runnable: true }): this.setState({ runnable: false });
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

  //checks the reponse for errors
  checkForErrors(response) {
    let networkError = this.responseIsTimeoutOrEmpty(response);
    let serverError = this.isServerError(response);
    return networkError || serverError;
  }

  //checks the response from a REST call for timeout errors or empty responses
  responseIsTimeoutOrEmpty(response) {
    if (!response) {
      let msg = "No response received from server";
      this.setState({ snackbarOpen: true, snackbarMessage: msg, loggingIn: false });
      return true;
    }
    else {
      return false;
    }
  }

  //checks to see if the rest server raised an error and if it did then show in the snackbar
  isServerError(response) {
    //errors may come from the marxan server or from the rest server which have slightly different json responses
    if ((response.error) || (response.hasOwnProperty('metadata') && response.metadata.hasOwnProperty('error') && response.metadata.error != null)) {
      var err = (response.error) ? (response.error) : response.metadata.error;
      this.setState({ snackbarOpen: true, snackbarMessage: err });
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
    jsonp(MARXAN_ENDPOINT + "validateUser?user=" + this.state.user + "&password=" + this.state.password, { timeout: 10000 }).promise.then(function(response) {
      if (!this.checkForErrors(response)) {
        //user validated - log them in
        this.login();
      }
      else {
        this.setState({ loggingIn: false });
      }
    }.bind(this));
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
    jsonp(MARXAN_ENDPOINT + "resendPassword?user=" + this.state.user, { timeout: TIMEOUT }).promise.then(function(response) {
      this.setState({ resending: false });
      if (!this.checkForErrors(response)) {
        this.setState({ snackbarOpen: true, snackbarMessage: "Password resent" });
      }
    }.bind(this));
  }

  //gets all the information for the user that is logging in
  getUserInfo() {
    jsonp(MARXAN_ENDPOINT + "getUser?user=" + this.state.user, { timeout: TIMEOUT }).promise.then(function(response) {
      if (!this.checkForErrors(response)) {
        this.setState({ scenario: response.userData.LASTSCENARIO, userData: response.userData });
        //get the users tilesets from mapbox
        this.getTilesets();
      }
    }.bind(this));
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
      return null;
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
    post(MARXAN_ENDPOINT + "updateUser", formData, config).then((response) => {
      if (!this.checkForErrors(response.data)) {
        //if succesfull write the state back to the userData key
        this.setState({ snackbarOpen: true, snackbarMessage: response.data.info, userData: this.newUserData, savingOptions: false, optionsDialogOpen: false });
      }
    });
    //update the state
    this.newUserData = Object.assign(this.state.userData, parameters);
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
  //opens the filess dialog whos open state is controlled
  openFilesDialog() {
    this.setState({ filesDialogOpen: true });
  }
  //closes the run parameters dialog whos open state is controlled
  closeFilesDialog() {
    this.setState({ filesDialogOpen: false });
  }

  //updates the parameters for the current scenario back to the server
  updateRunParams(array) {
    //ui feedback
    this.setState({ updatingRunParameters: true });
    //convert the parameters array into an object
    let parameters = {};
    array.map((obj) => { parameters[obj.key] = obj.value; return null; });
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
    post(MARXAN_ENDPOINT + "updateRunParams", formData, config).then((response) => {
      //ui feedback
      this.setState({ updatingRunParameters: false });
      if (!this.checkForErrors(response.data)) {
        //get the number of runs from the run parameters array
        let numReps = this.runParams.filter(function(item) { return item.key === "NUMREPS" })[0].value;
        //if succesfull write the state back 
        this.setState({ snackbarOpen: true, snackbarMessage: response.data.info, runParams: this.runParams, filesDialogOpen: false, numReps: numReps });
      }
    });
    //save the local state to be able to update the state on callback
    this.runParams = Object.assign(this.state.runParams, formData);
  }

  //gets all of the tilesets from mapbox using the access token for the currently logged on user - this access token must have the TILESETS:LIST scope
  getTilesets() {
    //get the tilesets for the user
    let client = new MapboxClient(this.state.userData.MAPBOXACCESSTOKEN);
    client.listTilesets(function(err, tilesets) {
      //check if there are no timeout errors or empty responses
      if (!this.responseIsTimeoutOrEmpty(tilesets)) {
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
    }.bind(this));
  }

  //loads a scenario
  loadScenario(scenario) {
    this.setState({ loadingScenario: true });
    //reset the results from any previous scenarios
    this.resetResults();
    jsonp(MARXAN_ENDPOINT + "getScenario?user=" + this.state.user + "&scenario=" + scenario, { timeout: TIMEOUT }).promise.then(function(response) {
      this.setState({ loadingScenario: false, loggingIn: false });
      if (!this.checkForErrors(response)) {
        //get the number of runs from the run parameters array
        let numReps = response.runParameters.filter(function(item) { return item.key === "NUMREPS" })[0].value;
        //set the state for the app based on the data that is returned from the server
        this.setState({ loggedIn: true, scenario: response.scenario, runParams: response.runParameters, numReps: numReps, files: Object.assign(response.files), metadata: response.metadata, renderer: response.renderer, planning_units: response.planning_units, preprocessing: response.preprocessing });
        //set the puidsToExclude from the pu.dat file
        var puidsToExclude = (response.planning_units.length > 1) && (response.planning_units[1].length > 1) ? response.planning_units[1][1] : [];
        this.setState({ puidsToExclude: puidsToExclude });
        //initialise all the interest features with the interest features for this scenario
        this.initialiseInterestFeatures(response.metadata.OLDVERSION, response.features, response.allFeatures);
        //if there is a PLANNING_UNIT_NAME passed then programmatically change the select box to this map 
        if (response.metadata.PLANNING_UNIT_NAME) {
          this.changeTileset(MAPBOX_USER + "." + response.metadata.PLANNING_UNIT_NAME);
        }
        //poll the server to see if results are available for this scenario - if there are these will be loaded
        this.pollResults(true);
      }
    }.bind(this));
  }

  //called when the mapbox planning unit layer has changed
  changeTileset(tilesetid) {
    this.getMetadata(tilesetid).then(function(response) {
      this.spatialLayerChanged(response, true);
    }.bind(this));
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

  //matches and returns an item in an object array with the passed id - this assumes the first item in the object is the id identifier
  getArrayItem(arr, id) {
    let tmpArr = arr.filter(function(item) { return item[0] === id });
    let returnValue = (tmpArr.length > 0) ? tmpArr[0] : undefined;
    return returnValue;
  }

  //initialises the interest features based on the current scenario
  initialiseInterestFeatures(oldVersion, scenarioFeatures, allFeatures) {
    var allInterestFeatures = [];
    if (oldVersion === 'True') {
      //if the database is from an old version of marxan then the interest features can only come from the list of features in the current scenario
      allInterestFeatures = scenarioFeatures;
    }
    else {
      //if the database is from marxan web then the interest features will come from the marxan postgis database metadata_interest_features table
      allInterestFeatures = allFeatures;
    }
    //get a list of the ids for the features that are in this scenario
    var ids = scenarioFeatures.map(function(item) {
      return item.id;
    });
    //iterate through allInterestFeatures to add the required attributes to be used in the app and to populate them based on the current scenario features
    var outFeatures = allInterestFeatures.map(function(item) {
      //see if the feature is in the current scenario
      var scenarioFeature = (ids.indexOf(item.id) > -1) ? scenarioFeatures[ids.indexOf(item.id)] : null;
      //get the preprocessing for that feature
      let preprocessing = this.getArrayItem(this.state.preprocessing, item.id);
      //if the interest feature is in the current scenario then populate the data from that feature
      if (scenarioFeature) {
        item['selected'] = true;
        item['preprocessed'] = preprocessing ? true : false;
        item['pu_area'] = preprocessing ? preprocessing[1] : -1;
        item['pu_count'] = preprocessing ? preprocessing[2] : -1;
        item['spf'] = scenarioFeature['spf'];
        item['target_value'] = scenarioFeature['target_value'];
      }
      else {
        item['selected'] = false;
        item['preprocessed'] = false;
        item['pu_area'] = -1;
        item['pu_count'] = -1;
        item['spf'] = 40;
        item['target_value'] = 17;
      }
      //add the other required attributes to the features - these will be populated in the function calls preprocessFeature (pu_area, pu_count) and pollResults (protected_area, target_area)
      // the -1 flag indicates that the values are unknown
      item['target_area'] = -1;
      item['protected_area'] = -1;
      return item;
    }, this);
    this.setState({ allFeatures: outFeatures, scenarioFeatures: outFeatures.filter(function(item) { return item.selected }) });
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
    formData.append('scenario', 'Sample case study');
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    };
    post(MARXAN_ENDPOINT + "createUser", formData, config).then((response) => {
      this.setState({ creatingNewUser: false });
      if (!this.checkForErrors(response.data)) {
        this.setState({ snackbarOpen: true, snackbarMessage: response.data.info + ". Close and login" });
      }
      else {
        this.setState({ snackbarOpen: true, snackbarMessage: response.data.error });
      }
    });
  }

  //REST call to create a new scenario for a specific user
  createNewScenario(scenario) {
    this.setState({ loadingScenarios: true });
    jsonp(MARXAN_ENDPOINT + "createScenario?user=" + this.state.user + "&scenario=" + scenario.name + "&description=" + scenario.description, { timeout: TIMEOUT }).promise.then(function(response) {
      if (!this.checkForErrors(response)) {
        //refresh the scenarios list
        this.listScenarios();
        this.setState({ snackbarOpen: true, snackbarMessage: response.info });
      }
      else {
        //ui feedback
        this.setState({ loadingScenarios: false });
      }
    }.bind(this));
  }

  //REST call to create a new scenario from the wizard
  createNewScenarioFromWizard(scenario) {
    this.setState({ loadingScenarios: true });
    let formData = new FormData();
    formData.append('user', this.state.user);
    formData.append('scenario', scenario.name);
    formData.append('description', scenario.description);
    formData.append('planning_grid_name', scenario.planning_grid_name);
    var interest_features = [];
    var target_values = [];
    var spf_values = [];
    this.state.scenarioFeatures.map((item) => {
      interest_features.push(item.id);
      target_values.push(item.target_value);
      spf_values.push(40);
    });
    //prepare the data that will populate the spec.dat file
    formData.append('interest_features', interest_features.join(","));
    formData.append('target_values', target_values.join(","));
    formData.append('spf_values', spf_values.join(","));
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    };
    post(MARXAN_ENDPOINT + "createScenarioFromWizard", formData, config).then((response) => {
      this.setState({ loadingScenarios: false });
      if (!this.checkForErrors(response.data)) {
        this.setState({ snackbarOpen: true, snackbarMessage: response.data.info });
        this.loadScenario(response.name);
      }
      else {
        this.setState({ snackbarOpen: true, snackbarMessage: response.data.error });
      }
    });
  }

  //REST call to delete a specific scenario
  deleteScenario(name) {
    this.setState({ loadingScenarios: true });
    jsonp(MARXAN_ENDPOINT + "deleteScenario?user=" + this.state.user + "&scenario=" + name, { timeout: TIMEOUT }).promise.then(function(response) {
      if (!this.checkForErrors(response)) {
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
    }.bind(this));
  }

  cloneScenario(name) {
    this.setState({ loadingScenarios: true });
    jsonp(MARXAN_ENDPOINT + "cloneScenario?user=" + this.state.user + "&scenario=" + name, { timeout: TIMEOUT }).promise.then(function(response) {
      if (!this.checkForErrors(response)) {
        //refresh the scenarios list
        this.listScenarios();
        //ui feedback
        this.setState({ snackbarOpen: true, snackbarMessage: response.info });
      }
      else {
        //ui feedback
        this.setState({ loadingScenarios: false });
      }
    }.bind(this));
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
      jsonp(MARXAN_ENDPOINT + "renameScenario?user=" + this.state.user + "&scenario=" + this.state.scenario + "&newName=" + newName, { timeout: TIMEOUT }).promise.then(function(response) {
        if (!this.checkForErrors(response)) {
          this.setState({ scenario: response.scenario, snackbarOpen: true, snackbarMessage: response.info });
        }
      }.bind(this));
    }
  }

  renameDescription(newDesc) {
    this.setState({ editingDescription: false });
    if (newDesc !== '' && newDesc !== this.state.metadata.DESCRIPTION) {
      jsonp(MARXAN_ENDPOINT + "renameDescription?user=" + this.state.user + "&scenario=" + this.state.scenario + "&newDesc=" + newDesc, { timeout: TIMEOUT }).promise.then(function(response) {
        if (!this.checkForErrors(response)) {
          this.setState({ metadata: Object.assign(this.state.metadata, { DESCRIPTION: response.description }), snackbarOpen: true, snackbarMessage: response.info });
        }
      }.bind(this));
    }
  }

  listScenarios() {
    this.setState({ loadingScenarios: true });
    jsonp(MARXAN_ENDPOINT + "listScenarios?user=" + this.state.user, { timeout: TIMEOUT }).promise.then(function(response) {
      this.setState({ loadingScenarios: false });
      if (!this.checkForErrors(response)) {
        this.setState({ scenarios: response.scenarios });
      }
      else {
        this.setState({ scenarios: undefined });
      }
    }.bind(this));
  }

  //updates a parameter in the input.dat file directly
  updateParameter(parameter, value) {
    jsonp(MARXAN_ENDPOINT + "updateParameter?user=" + this.state.user + "&scenario=" + this.state.scenario + "&parameter=" + parameter + "&value=" + value, { timeout: TIMEOUT }).promise.then(function(response) {
      if (!this.checkForErrors(response)) {
        //do something
      }
    }.bind(this));
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////CODE TO PREPROCESS AND RUN MARXAN
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  //run a marxan job on the server
  runMarxan(e) {
    //ui feedback
    this.setState({ preprocessingFeature: true });

    //the spec.dat file with any that have changed target or spf
    this.updateSpecFile().then(function(value) {

      //when the species file has been updated, update the planning unit file 
      this.updatePuFile();

      //when the planning unit file has been updated, update the PuVSpr file - this does all the preprocessing
      this.updatePuvsprFile().then(function(value) {

        //start the marxan job
        this.startMarxanJob();

        //set processing to have ended
        this.setState({ preprocessingFeature: false });

      }.bind(this));

    }.bind(this));
  }

  //updates the species file with any target values that have changed
  updateSpecFile() {
    let formData = new FormData();
    formData.append('user', this.state.user);
    formData.append('scenario', this.state.scenario);
    var interest_features = [];
    var target_values = [];
    var spf_values = [];
    this.state.scenarioFeatures.map((item) => {
      interest_features.push(item.id);
      target_values.push(item.target_value);
      spf_values.push(40);
    });
    //prepare the data that will populate the spec.dat file
    formData.append('interest_features', interest_features.join(","));
    formData.append('target_values', target_values.join(","));
    formData.append('spf_values', spf_values.join(","));
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    };
    return post(MARXAN_ENDPOINT + "updateSpecFile", formData, config).then((response) => {
      //check if there are no timeout errors or empty responses
      this.checkForErrors(response.data);
    });
  }

  //updates the planning unit file with any changes - not implemented yet
  updatePuFile() {

  }

  updatePuvsprFile() {
    //preprocess the features to create the puvspr.dat file on the server - this is done on demand when the scenario is run because the user may add/remove Conservation features willy nilly
    let promise = this.preprocessAllFeaturesSync();
    return promise;
  }

  //preprocess synchronously, i.e. one after another
  async preprocessAllFeaturesSync() {
    var features = this.state.scenarioFeatures.filter(function(feature) {
      return !feature.preprocessed;
    });
    //iterate through the features and preprocess the ones that need preprocessing
    for (var i = 0; i < features.length; ++i) {
      await this.preprocessFeature(features[i], false);
    }
  }

  //iterates through all of the features and preprocesses them asynchronously - i.e. all at once
  preprocessAllFeatures() {
    //return a promise array from each of the preprocessing jobs
    let promises = this.state.scenarioFeatures.map(feature => {
      if (!feature.preprocessed) {
        return this.preprocessFeature(feature, false);
      }
    }, this);
    //returns a single Promise that resolves when all of the promises in the promises array have resolved 
    return Promise.all(promises);
  }

  //preprocesses a feature - i.e. intersects it with the planning units grid and writes the intersection results into the puvspr.dat file ready for a marxan run
  preprocessFeature(feature, hideDialogOnFinish = true) {
    //show the preprocessing dialog and the feature alias
    this.setState({ preprocessingFeature: true, preprocessingFeatureAlias: feature.alias });
    return jsonp(MARXAN_ENDPOINT + "preprocessFeature?user=" + this.state.user + "&scenario=" + this.state.scenario + "&planning_grid_name=" + this.state.metadata.PLANNING_UNIT_NAME + "&feature_class_name=" + feature.feature_class_name + "&id=" + feature.id, { timeout: TIMEOUT }).promise.then(function(response) {
      if (!this.checkForErrors(response)) {
        //if we want to hide the dialog after processing has finished then do so
        if (hideDialogOnFinish) this.setState({ preprocessingFeature: false });
        //reset the preprocessingFeatureAlias to empty string
        this.setState({ preprocessingFeatureAlias: "" });
        //update the feature that has been preprocessed
        this.updateFeature(feature, "preprocessed", true, true);
        this.updateFeature(feature, "pu_count", Number(response.pu_count), true);
        this.updateFeature(feature, "pu_area", Number(response.pu_area), true);
      }
    }.bind(this));
  }

  //calls the marxan executeable and runs it
  startMarxanJob() {
    //reset all of the results for allFeatures - some features may have been removed from the current scenario and need resetting
    this.state.allFeatures.map(function(feature){
      if (!feature.selected){
        feature.protected_area = -1;
        feature.target_area = -1;
      }
    });
    //update the ui to reflect the fact that a job is running
    this.setState({ running: true, log: 'Running...', active_pu: undefined, outputsTabString: 'Running...' });
    //make the request to get the marxan data
    jsonp(MARXAN_ENDPOINT + "runMarxan?user=" + this.state.user + "&scenario=" + this.state.scenario);
    this.timer = setInterval(() => this.pollResults(false), 3000);
  }

  //poll the server to see if the run has completed
  pollResults(checkForExistingRun) {
    //make the request to get the marxan data
    jsonp(MARXAN_ENDPOINT + "pollResults?user=" + this.state.user + "&scenario=" + this.state.scenario + "&numreps=" + this.state.numReps + "&checkForExistingRun=" + checkForExistingRun, { timeout: TIMEOUT }).promise.then(function(response) {
      if (!this.checkForErrors(response)) {
        //the response includes the summed solution so it has finished
        if (response.ssoln) {
          this.runCompleted(response);
          //cancel the timer which polls the server to see when the run is complete
          clearInterval(this.timer);
          this.timer = null;
        }
        else {
          this.setState({ runsCompleted: response.runsCompleted });
        }
      }
      else {
        this.setState({ running: false });
      }
    }.bind(this));
  }

  //run completed
  runCompleted(response) {
    var responseText;
    //get the response and store it in this component
    this.runMarxanResponse = response;
    //if we have some data to map then set the state to reflect this
    (this.runMarxanResponse.ssoln && this.runMarxanResponse.ssoln.length > 0) ? this.setState({ dataAvailable: true }): this.setState({ dataAvailable: false });
    //render the sum solution map
    this.renderSolution(this.runMarxanResponse.ssoln, true);
    //create the array of solutions to pass to the InfoPanels table
    let solutions = response.sum;
    //the array data are in the format "Run_Number","Score","Cost","Planning_Units" - so create an array of objects to pass to the outputs table
    solutions = solutions.map(function(item) {
      return { "Run_Number": item[0], "Score": Math.floor(item[1]), "Cost": Math.floor(item[2]), "Planning_Units": item[3], "Missing_Values": item[12] };
    });
    //add in the row for the summed solutions
    solutions.splice(0, 0, { 'Run_Number': 'Sum', 'Score': '', 'Cost': '', 'Planning_Units': '', 'Missing_Values': '' });
    //update the amount of each target that is protected in the current run from the output_mvbest.txt file
    this.updateProtectedAmount();
    //ui feedback
    if (this.state.dataAvailable) {
      responseText = response.info;
    }
    else {
      responseText = "Run succeeded but no data returned";
      // this.setState({ brew: {} });
    }
    this.setState({ running: false, runsCompleted: 0, log: response.log.replace(/(\r\n|\n|\r)/g, "<br />"), outputsTabString: '', solutions: solutions, snackbarOpen: true, snackbarMessage: responseText });
  }

  //gets the protected area information in m2 from the marxan run and populates the interest features with the values
  updateProtectedAmount() {
    //iterate through the features and set the protected amount
    this.state.scenarioFeatures.map((feature) => {
      //get the matching item in the mvbest data
      let mvbestItemIndex = this.runMarxanResponse.mvbest.findIndex(function(item) { return item[0] === feature.id; });
      //get the mvbest data
      let mvbestItem = this.runMarxanResponse.mvbest[mvbestItemIndex];
      this.updateFeature(feature, "target_area",  mvbestItem[2], true);
      this.updateFeature(feature, "protected_area",  mvbestItem[3], true);
    }, this);
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////END OF CODE TO PREPROCESS AND RUN MARXAN
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
      jsonp(MARXAN_ENDPOINT + "loadSolution?user=" + this.state.user + "&scenario=" + this.state.scenario + "&solution=" + solution, { timeout: TIMEOUT }).promise.then(function(response) {
        if (!this.checkForErrors(response)) {
          this.renderSolution(response.solution, false);
        }
      }.bind(this));
    }
  }

  setPaintProperty(expression) {
    this.map.setPaintProperty("results_layer", "fill-color", expression);
    this.map.setPaintProperty("results_layer", "fill-opacity", 0.6);
    // this.map.setPaintProperty("results_layer", "fill-outline-color", "#888888");
  }

  //gets the total number of planning units in the ssoln and outputs the statistics of the distribution to state, e.g. 2 PUs with a value of 1, 3 with a value of 2 etc.
  getssolncount(data) {
    let total = 0;
    let summaryStats = [];
    data.map(function(item) {
      summaryStats.push({ number: item[0], count: item[1].length });
      total += item[1].length;
      return null;
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
      return null;
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
    if (this.state.dataAvailable) {
      var color, visibleValue, value;
      //create the renderer using Joshua Tanners excellent library classybrew - available here https://github.com/tannerjt/classybrew
      this.classifyData(data, Number(this.state.renderer.NUMCLASSES), this.state.renderer.COLORCODE, this.state.renderer.CLASSIFICATION);
      //build an expression to get the matching puids with different numbers of 'numbers' in the marxan results
      var expression = ["match", ["get", "puid"]];
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
  }

  //renders the planning units according to their status - 0: included, 1: excluded
  renderPU() {
    var color;
    //build an expression to get the matching puids with different statuses in the planning units data
    var expression = ["match", ["get", "puid"]];
    // the rest service sends the data grouped by the status, e.g. [23,34,36,43,98], 0
    this.state.planning_units.forEach(function(row, index) {
      //get the status
      switch (row[0]) {
        case 0: //included
          color = "rgba(150, 150, 150, 1)";
          break;
        case 1: //The PU will be included in the initial reserve system but may or may not be in the final solution.
          break;
        case 2: //The PU is fixed in the reserve system (“locked in”). It starts in the initial reserve system and cannot be removed.
          break;
        case 3: //The PU is fixed outside the reserve system (“locked out”). It is not included in the initial reserve system and cannot be added.
          color = "rgba(255, 150, 150, 1)";
          break;
      }
      //add the color to the expression 
      expression.push(row[1], color);
    });
    // Last value is the default, used where there is no data
    expression.push("rgba(0,0,0,0)");
    //set the render paint property
    this.map.setPaintProperty("planning_units_layer", "fill-color", "rgba(0, 0, 0, 0)");
    this.map.setPaintProperty("planning_units_layer", "fill-outline-color", expression);
  }

  mouseMove(e) {
    //error check
    if (!this.state.userData.SHOWPOPUP) return;
    //get the features under the mouse
    var features = this.map.queryRenderedFeatures(e.point, { layers: ["planning_units_layer"] });
    //see if there are any planning unit features under the mouse
    if (features.length) {
      //set the location for the popup
      if (!this.state.active_pu || (this.state.active_pu && this.state.active_pu.puid !== features[0].properties.puid)) this.setState({ popup_point: e.point });
      //get the properties from the vector tile
      let vector_tile_properties = features[0].properties;
      //get the properties from the marxan results - these will include the number of solutions that that planning unit is found in
      let marxan_results = this.runMarxanResponse && this.runMarxanResponse.ssoln ? this.runMarxanResponse.ssoln.filter(item => item[1].indexOf(vector_tile_properties.puid) > -1)[0] : {};
      if (marxan_results) {
        //convert the marxan results from an array to an object
        let marxan_results_dict = { "puid": vector_tile_properties.puid, "Number": marxan_results[0] };
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

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///MAP LAYERS ADDING/REMOVING AND INTERACTION
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  spatialLayerChanged(tileset, zoomToBounds) {
    //remove the existing results layer and planning unit layer
    this.removeSpatialLayers();
    //add a new results layer and planning unit layer
    this.addSpatialLayers(tileset);
    //zoom to the layers extent
    this.zoomToBounds(tileset.bounds);
    //set the state
    this.setState({ tileset: tileset });
  }

  removeSpatialLayers() {
    let layers = this.map.getStyle().layers;
    //get the dynamically added layers
    let dynamicLayers = layers.filter((item) => {
      return !(item.source === 'composite' || item.id === 'background');
    });
    //remove them from the map
    dynamicLayers.map(function(item) {
      this.map.removeLayer(item.id);
      this.map.removeSource(item.source);
    }, this);
  }
  //adds the results layer and planning unit layer to the map
  addSpatialLayers(tileset) {
    //add the results layer
    this.addSpatialLayer(tileset, "results_layer");
    //add the planning unit layer
    this.addSpatialLayer(tileset, "planning_units_layer");
    //add the highlight layer to show which planning units are selected
    this.addSpatialLayer(tileset, "highlighted_planning_units_layer");
    //set the default paint properties of the highlighted layer
    this.map.setPaintProperty("highlighted_planning_units_layer", "fill-color", "rgba(255,0,0,0.1)");
    this.map.setPaintProperty("highlighted_planning_units_layer", "fill-outline-color", "rgba(255,0,0,1)");
  }

  addSpatialLayer(tileset, id) {
    this.map.addLayer({
      'id': id,
      'type': "fill",
      'source': {
        'type': "vector",
        'url': "mapbox://" + tileset.id
      },
      'source-layer': tileset.name,
      'paint': {
        'fill-color': "rgba(255,0,0,0)",
        'fill-opacity': 0
      }
    }, 'place-city-sm');
  }

  //fired when the scenarios tab is selected
  scenario_tab_active() {
    //hide the planning units layer
    this.hideLayer("planning_units_layer");
  }

  //fired when the features tab is selected
  features_tab_active() {
    if (this.state.dataAvailable) {
      //render the sum solution map
      this.renderSolution(this.runMarxanResponse.ssoln, true);
      //hide the planning units layer
      this.hideLayer("planning_units_layer");
    }
  }

  //fired when the planning unit tab is selected
  pu_tab_active() {
    //render the planning units layer using the data from the planning_units state
    this.renderPU();
    this.showLayer("planning_units_layer");
  }

  showLayer(id) {
    this.map.setPaintProperty(id, "fill-opacity", 1);
  }
  hideLayer(id) {
    this.map.setPaintProperty(id, "fill-opacity", 0);
  }

  startPuEditSession() {
    //set the cursor to a crosshair
    this.map.getCanvas().style.cursor = "crosshair";
    //add the mouse click event to the planning unit layer
    this.map.on("click", "planning_units_layer", this.editPu);
    //set the filter for the selected planning units
    this.map.setFilter("highlighted_planning_units_layer", ["in", "puid"].concat(this.state.puidsToExclude));
    //show the layer
    this.showLayer("highlighted_planning_units_layer");
  }

  stopPuEditSession() {
    //reset the cursor
    this.map.getCanvas().style.cursor = "pointer";
    //remove the mouse click event
    this.map.off("click", "planning_units_layer", this.editPu);
    //update the pu.dat file
    this.updatePuDatFile();
    //hide the layer
    this.hideLayer("highlighted_planning_units_layer");
  }

  //sends a list of puids that should be excluded from the run to upddate the pu.dat file
  updatePuDatFile() {
    //initialise the form data
    let formData = new FormData();
    //add the current user
    formData.append("user", this.state.user);
    //add the current scenario
    formData.append("scenario", this.state.scenario);
    //add the puidsToExclude
    formData.append("puidsToExclude", this.state.puidsToExclude);
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    };
    //post to the server
    post(MARXAN_ENDPOINT + "updatePlanningUnitStatuses", formData, config).then((response) => {
      if (!this.checkForErrors(response.data)) {
        //if succesfull write the state back to the userData key
        this.setState({ snackbarOpen: true, snackbarMessage: response.data.info });
      }
    });
  }

  editPu(e) {
    //the this object refers to the map object
    var features = this.queryRenderedFeatures(e.point, { layers: ["planning_units_layer"] });
    var filter = features.reduce(function(memo, feature) {
      //see if the puid is already in the list  - if it is then the used is unselecting a planning unit
      var index = memo.slice(2).indexOf(feature.properties.puid);
      if (index === -1) {
        //add the item to the selected planning units
        memo.push(feature.properties.puid);
      }
      else {
        //remove the item from the selected planning units
        memo.splice(index + 2, 1);
      }
      return memo;
    }, ['in', 'puid'].concat(this.App.state.puidsToExclude));
    this.App.setState({ puidsToExclude: filter.slice(2) });
    this.setFilter("highlighted_planning_units_layer", filter);
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///END OF MAP LAYERS ADDING/REMOVING AND INTERACTION
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  zoomToBounds(bounds) {
    let minLng = (bounds[0] < -180) ? -180 : bounds[0];
    let minLat = (bounds[1] < -90) ? -90 : bounds[1];
    let maxLng = (bounds[2] > 180) ? 180 : bounds[2];
    let maxLat = (bounds[3] > 90) ? 90 : bounds[3];
    this.map.fitBounds([minLng, minLat, maxLng, maxLat], { padding: { top: 10, bottom: 10, left: 10, right: 10 }, easing: function(num) { return 1; } });
  }

  //ROUTINES FOR CREATING A NEW CASE STUDY

  openNewCaseStudyDialog() {
    this.setState({ newCaseStudyDialogOpen: true });
  }
  closeNewCaseStudyDialog() {
    this.setState({ newCaseStudyDialogOpen: false });
  }

  //gets the planning units from the marxan server
  getPlanningUnits() {
    //get a list of existing planning units 
    jsonp(REST_ENDPOINT + "getplanningunits?", { timeout: 10000 }).promise.then(function(response) {
      if (!this.checkForErrors(response)) {
        //valid response
        this.setState({ planningUnitGrids: response.records });
      }
      else {
        this.setState({ loggingIn: false });
      }
    }.bind(this));
  }

  openNewPlanningUnitDialog() {
    this.setState({ NewPlanningUnitDialogOpen: true });
  }
  closeNewPlanningUnitDialog() {
    this.setState({ NewPlanningUnitDialogOpen: false });
  }
  createNewPlanningUnitGrid() {
    this.setState({ creatingNewPlanningUnit: true });
    jsonp(REST_ENDPOINT + "get_hexagons?iso3=" + this.state.iso3 + "&domain=" + this.state.domain + "&areakm2=" + this.state.areakm2, { timeout: 0 }).promise.then(function(response) {
      if (!this.checkForErrors(response)) {
        //feedback
        this.setState({ snackbarOpen: true, snackbarMessage: "Planning grid: '" + response.records[0].get_hexagons.split(",")[1].replace(/"/gm, '').replace(")", "") + "' created" }); //response is (pu_cok_terrestrial_hexagons_10,"Cook Islands Terrestrial 10Km2 hexagon grid")
        //upload this data to mapbox for visualisation
        this.uploadToMapBox(response.records[0].get_hexagons.split(",")[0].replace(/"/gm, '').replace("(", ""), "hexagons");
        //update the planning unit items
        this.getPlanningUnits();
      }
      else {
        //do something
      }
      //reset the state
      this.setState({ creatingNewPlanningUnit: false });
      //close the NewPlanningUnitDialog
      this.closeNewPlanningUnitDialog();
    }.bind(this));
  }

  changeIso3(value) {
    this.setState({ iso3: value });
  }
  changeDomain(value) {
    this.setState({ domain: value });
  }
  changeAreaKm2(value) {
    this.setState({ areakm2: value });
  }
  getCountries() {
    jsonp(REST_ENDPOINT + "getcountries2", { timeout: 10000 }).promise.then(function(response) {
      if (!this.checkForErrors(response)) {
        //valid response
        this.setState({ countries: response.records });
      }
      else {
        this.setState({ loggingIn: false });
      }
    }.bind(this));
  }

  //uploads the names feature class to mapbox on the server
  uploadToMapBox(feature_class_name, mapbox_layer_name) {
    jsonp(MARXAN_ENDPOINT + "uploadTilesetToMapBox?feature_class_name=" + feature_class_name + "&mapbox_layer_name=" + mapbox_layer_name, { timeout: 300000 }).promise.then(function(response) {
      if (!this.checkForErrors(response)) {
        this.setState({ snackbarOpen: true, snackbarMessage: "Uploading to MapBox with the id: " + response.uploadid });
        this.timer = setInterval(() => this.pollMapboxForUploadComplete(response.uploadid), 5000);
      }
      else {
        //server error
      }
    }.bind(this));
  }

  pollMapboxForUploadComplete(uploadid) {
    var request = require('request');
    request("https://api.mapbox.com/uploads/v1/' + MAPBOX_USER + '/" + uploadid + "?access_token=sk.eyJ1IjoiYmxpc2h0ZW4iLCJhIjoiY2piNm1tOGwxMG9lajMzcXBlZDR4aWVjdiJ9.Z1Jq4UAgGpXukvnUReLO1g", this.pollMapboxForUploadCompleteResponse.bind(this));
  }

  pollMapboxForUploadCompleteResponse(error, response, body) {
    if (JSON.parse(body).complete) {
      clearInterval(this.timer);
      this.timer = null;
      this.setState({ snackbarOpen: true, snackbarMessage: "Uploaded to MapBox" });
    }
  }

  getInterestFeatures() {
    if (this.state.metadata.OLDVERSION === 'True') {
      //load the interest features as all of the features from the current scenario
      this.setState({ allFeatures: this.state.scenarioFeatures });
    }
    else {
      //load the interest features as all of the interest features from the marxan web database
      jsonp(REST_ENDPOINT + "get_interest_features?format=json", { timeout: 10000 }).promise.then(function(response) {
        if (!this.checkForErrors(response)) {
          this.setState({ allFeatures: response.records });
        }
        else {}
      }.bind(this));
    }
  }

  openNewInterestFeatureDialog() {
    this.setState({ NewInterestFeatureDialogOpen: true });
  }
  closeNewInterestFeatureDialog() {
    this.setState({ NewInterestFeatureDialogOpen: false });
  }
  openAllInterestFeaturesDialog() {
    this.setState({ AllInterestFeaturesDialogOpen: true });
  }
  closeAllInterestFeaturesDialog() {
    // this.updateSpecFile().then(function(response) {
      this.setState({ AllInterestFeaturesDialogOpen: false });
    // }.bind(this));
  }
  openAllCostsDialog() {
    this.setState({ AllCostsDialogOpen: true });
  }
  closeAllCostsDialog() {
    this.setState({ AllCostsDialogOpen: false });
  }
  setNewFeatureDatasetName(name) {
    this.setState({ featureDatasetName: name });
  }
  setNewFeatureDatasetDescription(description) {
    this.setState({ featureDatasetDescription: description });
  }
  setNewFeatureDatasetFilename(filename) {
    this.setState({ featureDatasetFilename: filename });
  }
  resetNewConservationFeature() {
    this.setState({ featureDatasetName: '', featureDatasetDescription: '', featureDatasetFilename: '' });
  }
  createNewInterestFeature() {
    //the zipped shapefile has been uploaded to the MARXAN folder and the metadata are in the featureDatasetName, featureDatasetDescription and featureDatasetFilename state variables - 
    jsonp(MARXAN_ENDPOINT + "importShapefile?filename=" + this.state.featureDatasetFilename + "&name=" + this.state.featureDatasetName + "&description=" + this.state.featureDatasetDescription + "&dissolve=true&type=interest_feature", { timeout: TIMEOUT }).promise.then(function(response) {
      if (!this.checkForErrors(response)) {
        this.setState({ snackbarOpen: true, snackbarMessage: response.info });
        this.getInterestFeatures();
      }
      else {
        //server error
      }
    }.bind(this));
  }

  //used by the import wizard to import a users zipped shapefile as the planning units
  importZippedShapefileAsPu(zipname, alias, description) {
    //the zipped shapefile has been uploaded to the MARXAN folder - it will be imported to PostGIS and a record will be entered in the metadata_planning_units table
    jsonp(MARXAN_ENDPOINT + "importShapefile?filename=" + zipname + "&name=" + alias + "&description=" + description + "&dissolve=false&type=planning_unit", { timeout: TIMEOUT }).promise.then(function(response) {
      if (!this.checkForErrors(response)) {
        this.setState({ snackbarOpen: true, snackbarMessage: response.info });
        var zipName = response.file.slice(0, -4);
        this.uploadToMapBox(zipName, zipName);
      }
      else {
        //server error
      }
    }.bind(this));
  }

  deleteInterestFeature(feature) {
    jsonp(MARXAN_ENDPOINT + "deleteInterestFeature?interest_feature_name=" + feature.feature_class_name, { timeout: TIMEOUT }).promise.then(function(response) {
      if (!this.checkForErrors(response)) {
        this.setState({ snackbarOpen: true, snackbarMessage: "Conservation feature deleted" });
        this.getInterestFeatures();
      }
      else {
        this.setState({ snackbarOpen: true, snackbarMessage: "Conservation feature not deleted" });
      }
    }.bind(this));
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////// MANAGING INTEREST FEATURES SECTION
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  //update feature value by finding the object and setting the value for the key - set override to true to overwrite an existing key value
  //this syncronises the states: allFeatures and scenarioFeatures as you cant detect state changes in object properties, i.e. componentDidUpdate is not called when you updated selected, preprocessed etc.
  updateFeature(feature, key, value, override) {
    console.log("Update feature '" + feature.feature_class_name + "' with " + key + "=" + value);
    let featuresCopy = this.state.allFeatures;
    //get the position of the feature 
    var index = featuresCopy.findIndex(function(element) { return element.id === feature.id; });
    var updatedFeature = featuresCopy[index];
    //update the value if either the property doesn't exist (i.e. new value) or it does and override is set to true
    if (updatedFeature && !(updatedFeature.hasOwnProperty(key) && !override)) updatedFeature[key] = value;
    //update allFeatures and scenarioFeatures with the new value
    this.setState({ allFeatures: featuresCopy, scenarioFeatures: featuresCopy.filter(function(item) { return item.selected }) });
  }

  //selects a single Conservation feature
  selectItem(feature) {
    this.updateFeature(feature, "selected", true, true); //select the Conservation feature
    this.updateFeature(feature, "target_value", 17, false); //set a default target value if one is not already set
  }

  //unselects a single Conservation feature
  unselectItem(feature) {
    this.updateFeature(feature, "selected", false, true); //unselect the Conservation feature
    this.updateFeature(feature, "preprocessed", false, true); //change the preprocessing to false
  }

  //selects all the Conservation features
  selectAll() {
    var features = this.state.allFeatures;
    features.map((feature) => {
      if (!feature.hasOwnProperty("target_value")) {
        //set the target value if it is not already set
        feature['target_value'] = 17;
      }
      //select the feature
      this.selectItem(feature);
    });
  }

  //clears all the Conservation features
  clearAll() {
    var features = this.state.allFeatures;
    features.map((feature) => {
      //unselect the item
      this.unselectItem(feature);
    });
  }

  //sets the target value of an feature
  updateTargetValue(feature, newTargetValue) {
    this.updateFeature(feature, "target_value", newTargetValue, true);
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////// END OF MANAGING INTEREST FEATURES SECTION
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  showSettingsDialog() {
    this.setState({ settingsDialogOpen: true });
  }
  closeSettingsDialog() {
    this.setState({ settingsDialogOpen: false });
  }

  openClassificationDialog() {
    this.setState({ classificationDialogOpen: true });
  }
  closeClassificationDialog() {
    this.setState({ classificationDialogOpen: false });
  }

  openImportWizard() {
    this.setState({ importDialogOpen: true });
  }
  closeImportWizard() {
    this.setState({ importDialogOpen: false });
  }

  uploadPlanningUnitFromShapefile() {

  }
  hideResults() {
    this.setState({ resultsPaneOpen: false });
  }
  showResults() {
    this.setState({ resultsPaneOpen: true });
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
            logout={this.logout.bind(this)}
            runMarxan={this.runMarxan.bind(this)} 
            running={this.state.running} 
            runnable={this.state.runnable}
            createNewScenario={this.createNewScenario.bind(this)}
            deleteScenario={this.deleteScenario.bind(this)}
            loadScenario={this.loadScenario.bind(this)}
            cloneScenario={this.cloneScenario.bind(this)}
            renameScenario={this.renameScenario.bind(this)}
            renameDescription={this.renameDescription.bind(this)}
            startEditingScenarioName={this.startEditingScenarioName.bind(this)}
            startEditingDescription={this.startEditingDescription.bind(this)}
            editingScenarioName={this.state.editingScenarioName}
            editingDescription={this.state.editingDescription}
            loadingScenarios={this.state.loadingScenarios}
            loadingScenario={this.state.loadingScenario}
            saveOptions={this.saveOptions.bind(this)}
            savingOptions={this.state.savingOptions}
            optionsDialogOpen={this.state.optionsDialogOpen}
            openOptionsDialog={this.openOptionsDialog.bind(this)}
            closeOptionsDialog={this.closeOptionsDialog.bind(this)}
            hidePopup={this.hidePopup.bind(this)}
            updateUser={this.updateUser.bind(this)}
            openNewCaseStudyDialog={this.openNewCaseStudyDialog.bind(this)}
            scenarioFeatures={this.state.scenarioFeatures}
            updateTargetValue={this.updateTargetValue.bind(this)}
            scenario_tab_active={this.scenario_tab_active.bind(this)}
            features_tab_active={this.features_tab_active.bind(this)}
            pu_tab_active={this.pu_tab_active.bind(this)}
            startPuEditSession={this.startPuEditSession.bind(this)}
            stopPuEditSession={this.stopPuEditSession.bind(this)}
            showSettingsDialog={this.showSettingsDialog.bind(this)}
            openImportWizard={this.openImportWizard.bind(this)}
            preprocessFeature={this.preprocessFeature.bind(this)}
            preprocessingFeature={this.state.preprocessingFeature}
            openAllInterestFeaturesDialog={this.openAllInterestFeaturesDialog.bind(this)}
          />
          <div className="runningSpinner">
            <ArrowBack style={{'display': (this.state.running ? 'block' : 'none')}}/>
          </div>
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
          <RunProgressDialog 
            preprocessingFeatureAlias={this.state.preprocessingFeatureAlias}
            preprocessingFeature={this.state.preprocessingFeature}
            running={this.state.running}
            runsCompleted={this.state.runsCompleted}
            numReps={this.state.numReps}
          />
          <NewCaseStudyDialog
            open={this.state.newCaseStudyDialogOpen}
            closeNewCaseStudyDialog={this.closeNewCaseStudyDialog.bind(this)}
            getPlanningUnits={this.getPlanningUnits.bind(this)}
            planningUnitGrids={this.state.planningUnitGrids}
            openNewPlanningUnitDialog={this.openNewPlanningUnitDialog.bind(this)}
            createNewScenario={this.createNewScenarioFromWizard.bind(this)}
            openAllInterestFeaturesDialog={this.openAllInterestFeaturesDialog.bind(this)}
            scenarioFeatures={this.state.scenarioFeatures}
            updateTargetValue={this.updateTargetValue.bind(this)}
            openAllCostsDialog={this.openAllCostsDialog.bind(this)}
            selectedCosts={this.state.selectedCosts}
            createNewScenarioFromWizard={this.createNewScenarioFromWizard.bind(this)}
          />
          <NewPlanningUnitDialog 
            open={this.state.NewPlanningUnitDialogOpen} 
            closeNewPlanningUnitDialog={this.closeNewPlanningUnitDialog.bind(this)} 
            createNewPlanningUnitGrid={this.createNewPlanningUnitGrid.bind(this)}
            creatingNewPlanningUnit={this.state.creatingNewPlanningUnit}
            getCountries={this.getCountries.bind(this)}
            countries={this.state.countries}
            changeIso3={this.changeIso3.bind(this)}
            changeDomain={this.changeDomain.bind(this)}
            changeAreaKm2={this.changeAreaKm2.bind(this)}
            iso3={this.state.iso3}
            domain={this.state.domain}
            areakm2={this.state.areakm2}
          />
          <AllInterestFeaturesDialog
            open={this.state.AllInterestFeaturesDialogOpen}
            allFeatures={this.state.allFeatures}
            scenarioFeatures={this.state.scenarioFeatures}
            deleteInterestFeature={this.deleteInterestFeature.bind(this)}
            closeAllInterestFeaturesDialog={this.closeAllInterestFeaturesDialog.bind(this)}
            openNewInterestFeatureDialog={this.openNewInterestFeatureDialog.bind(this)}
            selectItem={this.selectItem.bind(this)}
            unselectItem={this.unselectItem.bind(this)}
            selectAll={this.selectAll.bind(this)}
            clearAll={this.clearAll.bind(this)}
          />
          <AllCostsDialog
            open={this.state.AllCostsDialogOpen}
            costs={this.state.costs}
            closeAllCostsDialog={this.closeAllCostsDialog.bind(this)}
          />
          <NewInterestFeatureDialog
            open={this.state.NewInterestFeatureDialogOpen} 
            closeNewInterestFeatureDialog={this.closeNewInterestFeatureDialog.bind(this)}
            setName={this.setNewFeatureDatasetName.bind(this)}
            setDescription={this.setNewFeatureDatasetDescription.bind(this)}
            setFilename={this.setNewFeatureDatasetFilename.bind(this)}
            name={this.state.featureDatasetName}
            description={this.state.featureDatasetDescription}
            filename={this.state.featureDatasetFilename}
            createNewInterestFeature={this.createNewInterestFeature.bind(this)}
            resetNewConservationFeature={this.resetNewConservationFeature.bind(this)}
          />
          <SettingsDialog
            open={this.state.settingsDialogOpen}
            closeSettingsDialog={this.closeSettingsDialog.bind(this)}
            openFilesDialog={this.openFilesDialog.bind(this)}
            updateRunParams={this.updateRunParams.bind(this)}
            updatingRunParameters={this.state.updatingRunParameters}
            runParams={this.state.runParams}
          />
          <FilesDialog
            open={this.state.filesDialogOpen}
            closeFilesDialog={this.closeFilesDialog.bind(this)}
            fileUploaded={this.fileUploaded.bind(this)}
            user={this.state.user}
            scenario={this.state.scenario}
            files={this.state.files}
          />
          <ResultsPane
            running={this.state.running} 
            dataAvailable={this.state.dataAvailable} 
            solutions={this.state.solutions}
            loadSolution={this.loadSolution.bind(this)} 
            openClassificationDialog={this.openClassificationDialog.bind(this)}
            outputsTabString={this.state.outputsTabString} 
            hideResults={this.hideResults.bind(this)}
            open={this.state.resultsPaneOpen && this.state.loggedIn}
            brew={this.state.brew}
            log={this.state.log} 
          />
          <ClassificationDialog 
            open={this.state.classificationDialogOpen}
            renderer={this.state.renderer}
            closeClassificationDialog={this.closeClassificationDialog.bind(this)}
            changeColorCode={this.changeColorCode.bind(this)}
            changeRenderer={this.changeRenderer.bind(this)}
            changeNumClasses={this.changeNumClasses.bind(this)}
            changeShowTopClasses={this.changeShowTopClasses.bind(this)}
            summaryStats={this.state.summaryStats}
            brew={this.state.brew}
            dataBreaks={this.state.dataBreaks}
          />
          <ImportWizard 
            open={this.state.importDialogOpen}
            user={this.state.user}
            setFilename={this.uploadPlanningUnitFromShapefile.bind(this)}
            closeImportWizard={this.closeImportWizard.bind(this)}
            MARXAN_ENDPOINT={MARXAN_ENDPOINT}
            uploadShapefile={this.importZippedShapefileAsPu.bind(this)}
          />
          <div style={{position: 'absolute', display: this.state.resultsPaneOpen ? 'none' : 'block', backgroundColor: 'rgb(0, 188, 212)', right: '0px', top: '20px', width: '20px', borderRadius: '2px', height: '88px',boxShadow:'rgba(0, 0, 0, 0.16) 0px 3px 10px, rgba(0, 0, 0, 0.23) 0px 3px 10px'}} title={"Show results"}>
            <FlatButton
              onClick={this.showResults.bind(this)}
              primary={true}
              style={{minWidth:'24px',marginTop:'6px'}}
              title={"Show results"}
              icon={<ArrowBack color={white}/>}
            />
          </div>
        </React.Fragment>
      </MuiThemeProvider>
    );
  }
}

export default App;
