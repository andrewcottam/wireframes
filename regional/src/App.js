import React, { Component } from 'react';
import './App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Avatar from 'material-ui/Avatar';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import { List, ListItem } from 'material-ui/List';
import { Step, Stepper, StepLabel } from 'material-ui/Stepper';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import Subheader from 'material-ui/Subheader';
// import Badge from 'material-ui/Badge';
import Paper from 'material-ui/Paper';
import mapboxgl from 'mapbox-gl';
import logo_g1 from './logo-g1.png';
import logo_g2 from './logo-g2.png';
import logo_r1 from './logo-r1.png';
import logo_fji from './logo-fji.png';
import logo_slb from './logo-slb.png';
import logo_l1 from './logo-l1.png';
import intactForest from './intactForest.png';

class PoliciesDrawer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { open: true, indicatorOpen: false, activeIndicator: null };
  }

  buttonClick() {
    this.setState({ open: !this.state.open });
  }

  showIndicator(e) {
    this.setState({ open: false, indicatorOpen: true, activeIndicator: e });
  }

  hideIndicator(e) {
    // this.setState({ indicatorOpen: false });
  }

  render() {
    return <React.Fragment>
    <Drawer open={this.state.open} onRequestChange={(open) => this.setState({open})} containerStyle={{'position': 'absolute', 'top': '64px','overflow':'none'}} width={360}>
    <RaisedButton label="Knowledge" secondary={true} style={{"transform":"rotate(270deg)",'left': '319px','top': '360px','position': 'absolute'}} onClick={this.buttonClick.bind(this)}/>
    <PoliciesPanel onIndicatorSelected={this.showIndicator.bind(this)}/>
    </Drawer>;
    <IndicatorChart isOpen={this.state.indicatorOpen} indicator={this.state.activeIndicator}/>
    </React.Fragment>;
  }
}

class IndicatorChart extends React.Component {
  render() {
    let s = { 'position': 'absolute', left: '45px', 'width': '400px' };
    let containerStyle = {'boxShadow': "rgba(0, 0, 0, 0.25) 0px 14px 45px, rgba(0, 0, 0, 0.22) 0px 10px 18px"};
    return (this.props.isOpen ?
      <Card style={s} containerStyle={containerStyle}>
          <CardHeader
            title={this.props.indicator.policyListItem.props.primaryText}
            subtitle={this.props.indicator.policyListItem.props.secondaryText}
            avatar={this.props.indicator.policyListItem.props.leftAvatarSrc}
          />
          <CardMedia
            overlay={<CardTitle title={this.props.indicator.targetListItem.props.primaryText} subtitle={this.props.indicator.targetListItem.props.secondaryText.length>55 ? this.props.indicator.targetListItem.props.secondaryText.substring(0,55) + ".." : this.props.indicator.targetListItem.props.secondaryText}/>}
            title={this.props.indicator.targetListItem.props.secondaryText.length>55 ? this.props.indicator.targetListItem.props.secondaryText : null}
          >
            <img src={intactForest} alt="" />
          </CardMedia>
          <CardTitle subtitle={this.props.indicator.indicatorListItem.props.secondaryText}/>
          <CardText>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Donec mattis pretium massa. Aliquam erat vol
          </CardText>
        </Card> : null
    );
  }
}

class PoliciesPanel extends React.Component {
  indicatorSelected(e) {
    this.props.onIndicatorSelected(e);
  }
  render() {
    return <div><List>
    <Subheader>Policies</Subheader>
    <PolicyGroupHeader primaryText="Global" nestedItems={[
      <PolicyListItem key="g1" primaryText="Convention on Biological Diversity" secondaryText="Strategic Plan for Biodiversity 2011-2020" leftAvatarSrc={logo_g1} onIndicatorSelected={this.indicatorSelected.bind(this)} targets={[
        <div disabled={true} key="t1" primaryText="CBD Target 1" secondaryText="By 2020, at the latest, people are aware of the values of biodiversity and the steps they can take to conserve and use it sustainably."/>,
        <div disabled={true} key="t2" primaryText="CBD Target 2" secondaryText="By 2020, at the latest, biodiversity values have been integrated into national and local development and poverty reduction strategies and planning processes and are being incorporated into national accounting, as appropriate, and reporting systems."/>,
        <div key="t11" primaryText="CBD Target 11" secondaryText="By 2020, at least 17 per cent of terrestrial and inland water areas and 10 per cent of coastal and marine areas, especially areas of particular importance for biodiversity and ecosystem services, are conserved through effectively and equitably managed, ecologically representative and well-connected systems of protected areas and other effective area-based conservation measures, and integrated into the wider landscape and seascape." indicators={[
          <div key="i1" primaryText="Terrestrial protected area coverage" secondaryText="The total non-overlapping area of terrestrial protected areas"/>,
          <div key="i2" primaryText="Marine protected area coverage" secondaryText="The total non-overlapping area of marine protected areas"/>
          ]}/>
      ]}/>,
      <PolicyListItem key="g2" primaryText="Sustainable Development Goals" secondaryText="This is a fantastic groovy thing" leftAvatarSrc={logo_g2} onIndicatorSelected={this.indicatorSelected.bind(this)}/>
    ]}
    />
    <PolicyGroupHeader primaryText="Regional" nestedItems={[
      <PolicyListItem key="r1" primaryText="Framework for Nature Conservation and Protected Areas in the Pacific Islands Region" secondaryText="2014 - 2020" leftAvatarSrc={logo_r1} onIndicatorSelected={this.indicatorSelected.bind(this)} targets={[
        <div disabled={true} key="t1" primaryText="Objective 1" secondaryText="People are aware of the value of biodiversity and the steps they can take to use it sustainably"/>,
        <div disabled={true} key="t2" primaryText="Objective 2" secondaryText="Both economic development and biodiversity conservation recognise and support sustainable livelihoods, cultural heritage, knowledge and expressions, and community resilience and development aspirations"/>,
        <div key="t2" primaryText="Objective 3" secondaryText="Identify, conserve, sustainably manage and restore priority sites, habitats and ecosystems, including cultural sites" indicators={[
          <div key="i1" primaryText="Number of countries logging intact forests" secondaryText="Number of countries logging intact forests"/>
          ]}/>

      ]}/>
    ]}
    />
    <PolicyGroupHeader primaryText="National" nestedItems={[
      <PolicyListItem key="n1" primaryText="Fiji National Biodiversity Strategy and Action Plan" secondaryText="2017-2030" leftAvatarSrc={logo_fji} onIndicatorSelected={this.indicatorSelected.bind(this)}/>,
      <PolicyListItem key="n2" primaryText="Solomon Islands National Biodiversity Strategy and Action Plan" secondaryText="This is a fantastic groovy thing" leftAvatarSrc={logo_slb} onIndicatorSelected={this.indicatorSelected.bind(this)}/>
    ]}
    />
    <PolicyGroupHeader primaryText="Local" nestedItems={[
      <PolicyListItem key="l1" primaryText="O Le Pupū Puē National Park" secondaryText="Management Plan" leftAvatarSrc={logo_l1} onIndicatorSelected={this.indicatorSelected.bind(this)} targets={[
        <div key="t1" primaryText="Objective 1" secondaryText="Increase management effectiveness" indicators={[
          <div key="i3" primaryText="IMET Species Indicator" secondaryText="The total number of bunnies"/>,
          <div key="i4" primaryText="IMET Threat Assessment" secondaryText="The level of bad things happening"/>
          ]}/>
      ]}/>,
      <PolicyListItem key="l2" primaryText="Ngiri-Tumba-Maindombe NP" secondaryText="Management Plan" leftAvatarSrc={logo_l1} onIndicatorSelected={this.indicatorSelected.bind(this)}/>
    ]}
    />
  </List>
  <PanelLowerToolbar/>
  </div>
  }
}

function PolicyGroupHeader(props) {
  return <ListItem
    primaryText={props.primaryText}
    primaryTogglesNestedList={true}
    nestedItems={props.nestedItems}
    />;
}

class PolicyListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = { targetsOpen: false };
  }

  indicatorSelected(e) {
    this.setState({ targetsOpen: false });
    let hierarchy = Object.assign({}, e.hierarchy, { policyListItem: this });
    this.props.onIndicatorSelected(hierarchy);
  }

  handleClick() {
    this.setState({ targetsOpen: !this.state.targetsOpen });
  }

  render() {
    return (<React.Fragment><ListItem 
      primaryText={this.props.primaryText} 
      secondaryText={this.props.secondaryText} 
      leftAvatar={<Avatar src={this.props.leftAvatarSrc}/>}
      onClick={this.handleClick.bind(this)}
    />
    <TargetsDrawer targets={this.props.targets} open={this.state.targetsOpen} indicatorSelected={this.indicatorSelected.bind(this)}/>
    </React.Fragment>);
  }
}

class TargetsDrawer extends React.Component {
  render() {
    let containerStyle = {
      'position': 'absolute',
      'overflow': 'none',
      'left': (this.props.open ? '60px' : '0px')
    };
    const targets = this.props.targets && this.props.targets.map((target) => {
      return <TargetListItem primaryText={target.props.primaryText} key={target.props.primaryText} secondaryText={target.props.secondaryText} indicators={target.props.indicators} disabled={target.props.disabled} indicatorSelected={this.props.indicatorSelected.bind(this)}/>;
    });
    return (<React.Fragment>
    <Drawer containerStyle={containerStyle} width={360} open={this.props.open}>
    <Subheader>Targets</Subheader>
    <div>{targets}</div>
    </Drawer></React.Fragment>);
  }
}

class TargetListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = { targetsOpen: false, indicatorsOpen: false };
  }

  indicatorSelected(e) {
    this.setState({ indicatorsOpen: false });
    this.props.indicatorSelected({ hierarchy: { indicatorListItem: e, targetListItem: this } });
  }

  handleClick() {
    this.setState({ indicatorsOpen: !this.state.indicatorsOpen });
  }

  render() {
    let style = {
      'fontStyle': this.props.disabled ? 'italic' : 'normal'
    };
    return (<React.Fragment><ListItem 
      primaryText={this.props.primaryText}
      secondaryText = {this.props.secondaryText}
      title={this.props.secondaryText}
      onClick={this.handleClick.bind(this)}
      disabled={this.props.disabled}
      style={style}
    />
    <IndicatorsDrawer indicators={this.props.indicators} open={this.state.indicatorsOpen} indicatorSelected={this.indicatorSelected.bind(this)}/>
    </React.Fragment>);
  }
}

class IndicatorsDrawer extends React.Component {
  render() {
    let containerStyle = {
      'position': 'absolute',
      'overflow': 'none',
      'left': (this.props.open ? '62px' : '-62px')
    };
    const indicators = this.props.indicators && this.props.indicators.map((indicator) => {
      return <IndicatorListItem primaryText={indicator.props.primaryText} key={indicator.props.primaryText} secondaryText={indicator.props.secondaryText} onClick={this.props.indicatorSelected}/>;
    });
    return (<React.Fragment>
    <Drawer containerStyle={containerStyle} width={360} open={this.props.open}>
    <Subheader>Indicators</Subheader>
    <div>{indicators}</div>
    </Drawer>
    </React.Fragment>);
  }
}

class IndicatorListItem extends React.Component {
  indicatorSelected(e) {
    this.props.onClick(this);
  }
  render() {
    return (<React.Fragment>
    <ListItem 
      primaryText={this.props.primaryText}
      secondaryText = {this.props.secondaryText}
      title={this.props.secondaryText}
      onClick={this.indicatorSelected.bind(this)}
    >
    </ListItem>
    </React.Fragment>);
  }
}

class ActionsDrawer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { open: false };
  }

  buttonClick() {
    this.setState({ open: !this.state.open });
  }

  render() {
    return <Drawer open={this.state.open} containerStyle={{'position': 'absolute', 'top': '64px','overflow':'none'}} width={460} openSecondary={true}>
      <RaisedButton label="Actions" secondary={true} style={{"transform":"rotate(270deg)",'left': '-65px','top': '348px','position': 'absolute'}} onClick={this.buttonClick.bind(this)}/>
      <ActionsPanel/>
    </Drawer>;
  }
}

class ActionsPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = { digitisingFeatures: false };
  }
  handleClose() {
    this.setState({ digitisingFeatures: false });
  }
  digitiseFeatures() {
    this.setState({ open: true });
  }
  render() {
    return <List>
    <ActionsHeader text="Analyse"/>
    <ActionsHeader text="Contribute"/>
    <ActionListItem primaryText="Spatial Data" onClick={this.log}/>
    <ActionListItem primaryText="Species Observations" onClick={this.log}/>
    <ActionListItem primaryText="Photos" onClick={this.log}/>
    <ActionListItem primaryText="Digitise features" onClick={()=>this.setState({digitisingFeatures:true})}/>
    <ActionListItem primaryText="Protected Areas Information" onClick={this.log}/>
    <ActionsHeader text="Networking"/>
    <ActionsHeader text="Training"/>
    <Dialog title="Digitise Features"
            open={this.state.digitisingFeatures}
            actions={<HorizontalLinearStepper closeDialog={this.handleClose.bind(this)}/>}
            overlayStyle={{backgroundColor: 'transparent'}}
            onRequestClose={this.handleClose.bind(this)}
            modal={false}
            />
    </List>;

  }
}

function ActionsHeader(props) {
  return <Subheader>{props.text}</Subheader>;
}

function ActionListItem(props) {
  return <ListItem 
  primaryText={props.primaryText} 
  onClick={props.onClick}
  />;
}

function AddDrupalItem(props) {
  return <FloatingActionButton mini={true} secondary={true} className="addDrupalItem" title={props.title}>
    <ContentAdd />
    </FloatingActionButton>;
}

function PanelLowerToolbar(props) {
  return <Paper className="panelLowerPaper" zDepth={1}>
    <AddDrupalItem title="Add Indicator"/>
  </Paper>;
}

class Map extends React.Component {
  componentDidMount() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiYmxpc2h0ZW4iLCJhIjoiMEZrNzFqRSJ9.0QBRA2HxTb8YHErUFRMPZg'; //this is my access token
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      center: [21, -2], //salonga
      zoom: 3,
      style: 'mapbox://styles/blishten/cj6q75jcd39gq2rqm1d7yv5rc'
    });
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

class HorizontalLinearStepper extends React.Component {
  state = {
    finished: false,
    stepIndex: 0,
  };
  handleNext = () => {
    const { stepIndex } = this.state;
    this.setState({
      stepIndex: stepIndex + 1
    });
  };
  handlePrev = () => {
    const { stepIndex } = this.state;
    if (stepIndex > 0) {
      this.setState({ stepIndex: stepIndex - 1 });
    }
  };
  render() {
    const { stepIndex } = this.state;
    const contentStyle = { margin: '0 16px' };

    return (
      <div style={{width: '100%', maxWidth: 700, margin: 'auto',textAlign:'center'}}>
        <Stepper activeStep={stepIndex}>
          <Step>
            <StepLabel>Select your protected area</StepLabel>
          </Step>
          <Step>
            <StepLabel>Select your source imagery</StepLabel>
          </Step>
          <Step>
            <StepLabel>Start digitising features</StepLabel>
          </Step>
        </Stepper>
        <div style={contentStyle}>
              <div style={{marginTop: 12}}>
                <FlatButton
                  label="Back"
                  disabled={stepIndex === 0}
                  onClick={this.handlePrev}
                />
                <RaisedButton
                  label={stepIndex === 2 ? 'Finish' : 'Next'}
                  onClick={stepIndex === 2 ? this.props.closeDialog : this.handleNext}
                  primary={true}
                />
            </div>
        </div>
      </div>
    );
  }
}

class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <div className="App">
          <AppBar title="Biopama Regional Conservation Planning Tools" showMenuIconButton={false}/>
          <PoliciesDrawer />
          <Map/>
          <ActionsDrawer/>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
