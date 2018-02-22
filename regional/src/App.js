import React, { Component } from 'react';
import './App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Avatar from 'material-ui/Avatar';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import Divider from 'material-ui/Divider';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import Badge from 'material-ui/Badge';
import { List, ListItem } from 'material-ui/List';
import { Step, Stepper, StepLabel } from 'material-ui/Stepper';
import { Card, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import Subheader from 'material-ui/Subheader';
import { Tabs, Tab } from 'material-ui/Tabs';
import MapToolbar from './MapToolbar.js';
import Paper from 'material-ui/Paper';
import mapboxgl from 'mapbox-gl';
import logo_g1 from './logo-g1.png';
import logo_g2 from './logo-g2.png';
import logo_r1 from './logo-r1.png';
import logo_fji from './logo-fji.png';
import logo_slb from './logo-slb.png';
import logo_png from './logo-png.png';
import logo_tls from './logo-tls.png';
import logo_vut from './logo-vut.png';
import logo_l1 from './logo-l1.png';
import intactForest from './intactForest.png';
import indicatorHistory from './indicatorHistory.png';
import greenListLogo from './Green-List-logo-1.png';

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
    <IndicatorChart isOpen={this.state.indicatorOpen} indicator={this.state.activeIndicator} map={this.props.map}/>
    </React.Fragment>;
  }
}

function getCountries(map) {
  var filter = ['in', 'name_en', "American Samoa", "Cook Islands", "Federated States of Micronesia", "Fiji", "French Polynesia", "Guam", "Kiribati", "Marshall Islands", "Nauru", "New Caledonia", "Niue", "Northern Mariana Islands", "Palau", "Papua New Guinea", "Samoa", "Solomon Islands", "Tokelau", "Tonga", "Tuvalu", "Vanuatu", "Wallis and Futuna"];
  var countries_lg = map.queryRenderedFeatures({ layers: ['country-label-lg'], filter: filter });
  var countries_md = map.queryRenderedFeatures({ layers: ['country-label-md'], filter: filter });
  var countries_sm = map.queryRenderedFeatures({ layers: ['country-label-sm'], filter: filter });
  var countries = countries_lg.concat(countries_md).concat(countries_sm);
  for (var i = 0; i < countries.length; i++) {
    console.log(countries[i].properties.name_en);
  }
  return countries;
}

class CountryListItem extends React.Component {
  drillCountry() {
    this.props.drillCountry({ countryListItem: this });
  }
  render() {
    return (
      <React.Fragment>
        <ListItem primaryText={this.props.primaryText} secondaryText={this.props.secondaryText} leftAvatar={this.props.leftAvatar} onClick={this.drillCountry.bind(this)} innerDivStyle={{padding:'16px 16px 16px 67px'}}/> 
      </React.Fragment>
    );
  }
}

class ProvinceListItem extends React.Component {
  drillProvince() {
    this.props.drillProvince({ provinceListItem: this });
  }
  render() {
    return (
      <React.Fragment>
        <ListItem primaryText={this.props.primaryText} onClick={this.drillProvince.bind(this)} innerDivStyle={{padding:'3px 10px 3px 20px'}}/> 
      </React.Fragment>
    );
  }
}

class IndicatorChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: 'Indicator', selectedCountry: null, selectedProvince: null };
  }
  handleChange = (value) => {
    this.setState({
      value: value,
    });
  };
  drillCountries() {
    this.setState({ value: 'Region' });
    this.props.map.setCenter([161.76, -8.14]);
    this.props.map.zoomTo(4);
  }
  drillCountry(e) {
    this.setState({ value: 'country', selectedCountry: e.countryListItem });
    this.props.map.fitBounds(e.countryListItem.props.bounds, {
      padding: { top: 50, bottom: 50, left: 600, right: 50 }
    });
  }
  drillProvince(e) {
    this.setState({ value: 'province', selectedProvince: e.provinceListItem });
    this.props.map.fitBounds(e.provinceListItem.props.bounds, {
      padding: { top: 50, bottom: 50, left: 600, right: 50 }
    });
  }
  render() {
    let s = { position: 'absolute', left: '45px', width: '440px' };
    let containerStyle = { boxShadow: "rgba(0, 0, 0, 0.25) 0px 14px 45px, rgba(0, 0, 0, 0.22) 0px 10px 18px" };
    var children;
    if (this.props.indicator){
      switch (this.props.indicator.indicatorListItem.props.primaryText) {
        case 'Number of countries logging intact forests':
          children =
            <React.Fragment>
              <Tabs        
                value={this.state.value}
                onChange={this.handleChange}
                >
                <Tab 
                  label="Indicator" 
                  value="Indicator"
                  buttonStyle={{height:'25px',padding:'3px 0px 3px 0px'}}
                  style={{fontSize:'12px'}}
                  >
                  {this.props.indicator ? 
                  <div
                    style={{padding:'12px',fontSize:'19px'}}>
                    {this.props.indicator.indicatorListItem.props.primaryText}
                  </div> : null }
                  <React.Fragment>
                  <div style={{textAlign:'center'}}>    
                    <Badge
                      badgeContent={4}
                      primary={true}
                      title="Click to show the countries in the region"
                      badgeStyle={{top: 25, right: 25, cursor :'pointer'}}
                      onClick={this.drillCountries.bind(this)}
                      >
                      <img 
                        src={indicatorHistory}
                      />
                    </Badge>
                  </div>
                  {this.props.indicator ?
                  <CardText 
                    style={{padding:'12px',fontSize:'13px'}}>{this.props.indicator.indicatorListItem.props.desc ? this.props.indicator.indicatorListItem.props.desc : "No description."}
                  </CardText>
                  : null}
                  </React.Fragment>
                </Tab>
                <Tab 
                  label="Region" 
                  value="Region"
                  buttonStyle={{height:'25px',padding:'3px 0px 3px 0px'}}
                  style={{fontSize:'12px'}}
                  >
                  <List style={{padding:'0px'}}>
                    <CountryListItem 
                      primaryText="Papua New Guinea" 
                      secondaryText={
                          <span style={{fontSize: '11px'}}>1,647Km<span style={{verticalAlign: 'super',fontSize: '7px'}}>2</span></span>
                      }
                      leftAvatar={<Avatar src={logo_png} size={30} style={{top:"16px"}}/>}
                      drillCountry={this.drillCountry.bind(this)}
                      bounds={[140.8343505859375,-11.655380249023438,157.03778076171885,-0.7558330297469293]}
                    />
                    <CountryListItem
                      primaryText="Solomon Islands"
                      secondaryText={
                          <span style={{fontSize: '11px'}}>775Km<span style={{verticalAlign: 'super',fontSize: '7px'}}>2</span></span>
                      }
                      leftAvatar={<Avatar src={logo_slb} size={30} style={{top:"16px"}}/>}
                      drillCountry={this.drillCountry.bind(this)}
                      bounds={[155.3925018310548,-12.308334350585824,170.19250488281273,-4.44521999359124]}
                    />
                    <CountryListItem
                      primaryText="Timor Leste"
                      secondaryText={
                          <span style={{fontSize: '11px'}}>346Km<span style={{verticalAlign: 'super',fontSize: '7px'}}>2</span></span>
                      }
                      leftAvatar={<Avatar src={logo_tls} size={30} style={{top:"16px"}}/>}
                      drillCountry={this.drillCountry.bind(this)}
                      bounds={[124.04465484619152,-9.50465297698969,127.34249877929703,-8.126944541931156]}
                    />
                    <CountryListItem
                      primaryText="Vanuatu"
                      secondaryText={
                          <span style={{fontSize: '11px'}}>91Km<span style={{verticalAlign: 'super',fontSize: '7px'}}>2</span></span>
                      }
                      leftAvatar={<Avatar src={logo_vut} size={30} style={{top:"16px"}}/>}
                      drillCountry={this.drillCountry.bind(this)}
                      bounds={[166.54139709472656,-22.400554656982422,172.09008789062503,-13.072476387023903]}
                    />
                  </List>
                  <CardText 
                    style={{padding:'12px',fontSize:'13px'}}>Area of Intact Forest logged in the last 25 years.
                  </CardText>
                </Tab>
                <Tab 
                  label="Country"
                  value="country"
                  buttonStyle={{height:'25px',padding:'3px 0px 3px 0px'}}
                  style={{fontSize:'12px'}}
                  >
                    {this.state.selectedCountry ? 
                      <React.Fragment>
                        <List style={{padding:'0px'}}>
                          <ListItem primaryText={this.state.selectedCountry.props.primaryText} secondaryText={this.state.selectedCountry.props.secondaryText} leftAvatar={this.state.selectedCountry.props.leftAvatar}  innerDivStyle={{padding:'16px 16px 16px 67px'}}/>
                        </List> 
                        <Divider />
                        <List>
                          <ProvinceListItem primaryText="Central" bounds={[146.38201904296886,-10.409167289733773,149.66452026367213,-7.7725348472595215]} drillProvince={this.drillProvince.bind(this)}/>
                          <ProvinceListItem primaryText="Chimbu" bounds={[144.42181396484386,-6.868734836578312,145.35041809082034,-5.775935173034526]} drillProvince={this.drillProvince.bind(this)}/>
                          <ProvinceListItem primaryText="East New Britain" bounds={[150.594207763672,-6.07494401931757,152.49851989746108,-4.087428092956465]} drillProvince={this.drillProvince.bind(this)}/>
                          <ProvinceListItem primaryText="East Sepik" bounds={[141.33921813964844,-5.158234119415283,144.83367919921875,-3.1891660690306907]} drillProvince={this.drillProvince.bind(this)}/>
                          <ProvinceListItem primaryText="Eastern Highlands" bounds={[144.98760986328125,-7.158435821533203,146.13621520996094,-5.852434158325202]} drillProvince={this.drillProvince.bind(this)}/>
                          <ProvinceListItem primaryText="Enga" bounds={[142.74942016601585,-5.975834846496582,144.24871826171875,-5.010334014892511]} drillProvince={this.drillProvince.bind(this)}/>
                          <ProvinceListItem primaryText="Gulf" bounds={[142.994110107422,-8.587371826171818,146.65251159667991,-6.7054347991942755]} drillProvince={this.drillProvince.bind(this)}/>
                          <ProvinceListItem primaryText="Madang" bounds={[143.9691162109375,-5.996534824371338,147.21833801269554,-3.9902749061584326]} drillProvince={this.drillProvince.bind(this)}/>
                          <ProvinceListItem primaryText="Manus" bounds={[142.8240509033203,-2.9321799278259277,148.20832824707034,-0.7558330297469982]} drillProvince={this.drillProvince.bind(this)}/>
                          <ProvinceListItem primaryText="Milne Bay" bounds={[148.96670532226562,-11.655380249023438,154.39971923828136,-8.30111217498781]} drillProvince={this.drillProvince.bind(this)}/>
                          <ProvinceListItem primaryText="Morobe" bounds={[145.74201965332054,-8.032334327697754,148.1841735839846,-5.280276775360104]} drillProvince={this.drillProvince.bind(this)}/>
                          <ProvinceListItem primaryText="New Ireland" bounds={[149.50520324707054,-4.851665019989014,154.75170898437503,-1.314795970916769]} drillProvince={this.drillProvince.bind(this)}/>
                          <ProvinceListItem primaryText="North Solomons" bounds={[154.09963989257824,-6.880917072296143,157.03778076171884,-4.355535984039303]} drillProvince={this.drillProvince.bind(this)}/>
                          <ProvinceListItem primaryText="Northern" bounds={[147.004119873047,-9.97723388671875,149.44386291503915,-8.004035949706989]} drillProvince={this.drillProvince.bind(this)}/>
                          <ProvinceListItem primaryText="Sandaun" bounds={[140.9997100830078,-5.378980159759408,143.09657287597693,-2.602708101272579]} drillProvince={this.drillProvince.bind(this)}/>
                          <ProvinceListItem primaryText="Southern Highlands" bounds={[142.06697082519554,-6.8236351013183025,144.6881103515626,-4.941134929656986]} drillProvince={this.drillProvince.bind(this)}/>
                          <ProvinceListItem primaryText="West New Britain" bounds={[148.3077850341798,-6.325832843780461,151.69001770019528,-4.535143852233887]} drillProvince={this.drillProvince.bind(this)}/>
                          <ProvinceListItem primaryText="Western" bounds={[140.8343505859375,-9.524073600769043,143.92416381835966,-4.987235069274884]} drillProvince={this.drillProvince.bind(this)}/>
                          <ProvinceListItem primaryText="Western Highlands" bounds={[143.7709197998047,-6.389835834503117,145.02641296386744,-5.218733787536607]} drillProvince={this.drillProvince.bind(this)}/>
                        </List>
                        <CardText 
                          style={{padding:'10px 0px 0px 11px',fontSize:'13px'}}>Area of Intact Forest logged in the last 25 years.
                        </CardText>
                      </React.Fragment>
                      : null}
                </Tab>
                <Tab 
                  label="Province"
                  value="province"
                  buttonStyle={{height:'25px',padding:'3px 0px 3px 0px'}}
                  style={{fontSize:'12px'}}
                  >
                    {this.state.selectedProvince ? 
                      <React.Fragment>
                        <List style={{padding:'0px'}}>
                          <ListItem primaryText={this.state.selectedCountry.props.primaryText} secondaryText={this.state.selectedCountry.props.secondaryText} leftAvatar={this.state.selectedCountry.props.leftAvatar}  innerDivStyle={{padding:'16px 16px 16px 67px'}}/>
                        </List> 
                        <Divider />
                        <List>
                          <ProvinceListItem primaryText={this.state.selectedProvince.props.primaryText} />
                        </List> 
                      </React.Fragment>
                      : null}
                </Tab>
              </Tabs>
            </React.Fragment>;
          break;
        case 'Terrestrial protected area coverage':
          this.props.map.setStyle('mapbox://styles/blishten/cj6f4n2j026qf2rnunkauikjm'); //terrestrial style
          break;
        case 'Marine protected area coverage':
          this.props.map.setStyle('mapbox://styles/blishten/cjdvudwue0nvt2stb8vfiv03c'); //marine style
          break;
        default:
      }
    }

    return (this.props.isOpen ?
      <Card style={s} containerStyle={containerStyle}>
          <CardHeader
            title={this.props.indicator.policyListItem.props.primaryText}
            // subtitle={this.props.indicator.policyListItem.props.secondaryText}
            avatar={this.props.indicator.policyListItem.props.leftAvatarSrc}
          />
          <CardMedia
            overlay={
              <CardTitle 
                title={this.props.indicator.targetListItem.props.primaryText} 
                subtitle={this.props.indicator.targetListItem.props.secondaryText.length>50 ? this.props.indicator.targetListItem.props.secondaryText.substring(0,50) + ".." : this.props.indicator.targetListItem.props.secondaryText}
              />}
            title={this.props.indicator.targetListItem.props.secondaryText.length>50 ? this.props.indicator.targetListItem.props.secondaryText : null}>
            <img src={intactForest} alt="" />
          </CardMedia>
          <CardTitle 
            style={{padding:'0px'}}
            children={children}
          />
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
    <Divider/>
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
        // <div disabled={true} key="t1" primaryText="Objective 1" secondaryText="People are aware of the value of biodiversity and the steps they can take to use it sustainably"/>,
        // <div disabled={true} key="t2" primaryText="Objective 2" secondaryText="Both economic development and biodiversity conservation recognise and support sustainable livelihoods, cultural heritage, knowledge and expressions, and community resilience and development aspirations"/>,
        <div key="t2" primaryText="Objective 3" secondaryText="Identify, conserve, sustainably manage and restore priority sites, habitats and ecosystems, including cultural sites" indicators={[
          <div key="i1" primaryText="Number of countries logging intact forests" secondaryText="Number of countries logging intact forests" desc="This indicator shows the number of countries that have logged Intact Forest Areas during the last 25 years."/>
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
      <PolicyListItem key="l1" primaryText="O Le Pupū Puē National Park" secondaryText="IUCN Green List Candidate" leftAvatarSrc={greenListLogo} onIndicatorSelected={this.indicatorSelected.bind(this)} targets={[
        <div key="t1" primaryText="Good governance" secondaryText="" indicators={[
          <div key="i3" primaryText="IMET Species Indicator" secondaryText="The total number of bunnies"/>,
          <div key="i4" primaryText="IMET Threat Assessment" secondaryText="The level of bad things happening"/>
          ]}/>,
        <div key="t1" primaryText="Sound design and planning" secondaryText="" indicators={[
          <div key="i3" primaryText="IMET Species Indicator" secondaryText="The total number of bunnies"/>,
          <div key="i4" primaryText="IMET Threat Assessment" secondaryText="The level of bad things happening"/>
          ]}/>,
        <div key="t1" primaryText="Good governance" secondaryText="" indicators={[
          <div key="i3" primaryText="IMET Species Indicator" secondaryText="The total number of bunnies"/>,
          <div key="i4" primaryText="IMET Threat Assessment" secondaryText="The level of bad things happening"/>
          ]}/>          
      ]}/>,
      <PolicyListItem key="l2" primaryText="Ngiri-Tumba-Maindombe NP" secondaryText="Management Plan" leftAvatarSrc={logo_l1} onIndicatorSelected={this.indicatorSelected.bind(this)} targets={[
        <div key="t1" primaryText="Objective 1" secondaryText="Increase management effectiveness" indicators={[
          <div key="i3" primaryText="IMET Species Indicator" secondaryText="The total number of bunnies"/>,
          <div key="i4" primaryText="IMET Threat Assessment" secondaryText="The level of bad things happening"/>
          ]}/>
      ]}/>
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
    <Divider/>
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
      return <IndicatorListItem desc={indicator.props.desc} primaryText={indicator.props.primaryText} key={indicator.props.primaryText} secondaryText={indicator.props.secondaryText} onClick={this.props.indicatorSelected}/>;
    });
    return (<React.Fragment>
    <Drawer containerStyle={containerStyle} width={360} open={this.props.open}>
    <Subheader>Indicators</Subheader>
    <Divider/>
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
    <ActionListItem primaryText="Spatial data" onClick={this.log}/>
    <ActionListItem primaryText="Species observations" onClick={this.log}/>
    <ActionListItem primaryText="Photos" onClick={this.log}/>
    <ActionListItem primaryText="Digitise features" onClick={()=>this.setState({digitisingFeatures:true})}/>
    <ActionListItem primaryText="Protected area boundaries" onClick={this.log}/>
    <ActionListItem primaryText="Management effectiveness data" onClick={this.log}/>
    <ActionsHeader text="Fund"/>
    <ActionListItem primaryText="View Action Fund proposals" onClick={this.log}/>
    <ActionsHeader text="Network"/>
    <ActionsHeader text="Reports"/>
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

function addGlobalForestWatch(map) {
  map.addLayer({
    'id': 'GlobalForestWatch',
    'type': 'raster',
    'source': {
      'type': 'raster',
      // "attribution":"Potapov P. et al. 2008. Mapping the World's Intact Forest Landscapes by Remote Sensing. Ecology and Society, 13 (2)",
      'tiles': [
        // 'https://globalforestwatch-624153201.us-west-1.elb.amazonaws.com/arcgis/services/ForestCover_lossyear/ImageServer/WMSServer?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&width=256&height=256&layers=0'
        // 'https://50.18.182.188:6080/arcgis/services/ForestCover_lossyear/ImageServer/WMSServer?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&width=256&height=256&layers=0'
        'http://gis-treecover.wri.org/arcgis/services/ForestCover_lossyear/ImageServer/WMSServer?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&width=256&height=256&layers=0'
      ],
      'tileSize': 256
    },
    "layout": {
      "visibility": "visible"
    },
    'maxzoom': 14,
    'minzoom': 7,
    'paint': {}
  }, 'Intact Forest 2013');
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { map: null };
  }
  mapLoaded(e) {
    this.setState({ map: e.target });
    addGlobalForestWatch(e.target);
  }
  render() {
    return (
      <MuiThemeProvider>
        <div className="App">
          <AppBar title="Biopama Regional Conservation Planning Tools" showMenuIconButton={false}/>
          <PoliciesDrawer map={this.state.map}/>
          <Map onLoad={this.mapLoaded.bind(this)}/>
          <MapToolbar map={this.state.map}/>
          <ActionsDrawer/>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;