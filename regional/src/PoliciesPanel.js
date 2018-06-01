import * as React from 'react';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import logo_g1 from './logo-g1.png';
import logo_g2 from './logo-g2.png';
import logo_r1 from './logo-r1.png';
import logo_r2 from './logo-r2.png';
import logo_r3 from './logo-r3.png';
import logo_fji from './logo-fji.png';
import logo_slb from './logo-slb.png';
import logo_l1 from './logo-l1.png';
import logo_png from './logo-png.png';
import greenListLogo from './Green-List-logo-1.png';
import { List, ListItem } from 'material-ui/List';
import PolicyListItem from './PolicyListItem.js';
import AddIndicator from './AddIndicator.js';
import Paper from 'material-ui/Paper';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Dialog from 'material-ui/Dialog';

function PolicyGroupHeader(props) {
  return (
    <ListItem primaryText={props.primaryText} primaryTogglesNestedList={true} nestedItems={props.nestedItems}/>
  );
}

class PanelLowerToolbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { open: false };
  }
  onClick(e){
    this.setState({ open: true });
  }
  requestClose(e) {
    this.setState({ open: false });
  }
  render() { 
    return (
      <Paper className="panelLowerPaper" zDepth={1}>
          <FloatingActionButton mini={true} secondary={true} className="addDrupalItem" title="Add indicator">
            <ContentAdd onClick={this.onClick.bind(this)}/>
          </FloatingActionButton>
          <Dialog title="Add indicator" overlayStyle={{backgroundColor: 'transparent'}} open={this.state.open} modal={false} onRequestClose={this.requestClose.bind(this)} actions={<AddIndicator closeDialog={this.requestClose.bind(this)}/>}/>
      </Paper>
    );
  }
}

class PoliciesPanel extends React.Component {
  indicatorSelected(e) {
    this.props.onIndicatorSelected(e);
  }
  render() {
    return (
      <React.Fragment>
                <List> 
                    <Subheader>Policies</Subheader>
                    <Divider/>
                    <PolicyGroupHeader primaryText="Global" nestedItems={[
                      <PolicyListItem {...this.props} key="g1" primaryText="Convention on Biological Diversity" secondaryText="Strategic Plan for Biodiversity 2011-2020" leftAvatarSrc={logo_g1} onIndicatorSelected={this.indicatorSelected.bind(this)} targets={[
                        <div key="t11" primaryText="CBD Target 11" secondaryText="By 2020, at least 17 per cent of terrestrial and inland water areas and 10 per cent of coastal and marine areas, especially areas of particular importance for biodiversity and ecosystem services, are conserved through effectively and equitably managed, ecologically representative and well-connected systems of protected areas and other effective area-based conservation measures, and integrated into the wider landscape and seascape." indicators={[
                          <div id="11" key="11" primaryText="Countries who have achieved the Terrestrial Coverage Target" secondaryText=">17% of terrestrial and inland water areas protected"/>,
                          <div id="12" key="12" primaryText="Countries who have achieved the Marine Coverage Target" secondaryText=">10% of coastal and marine areas protected"/>
                          ]}/>
                      ]}/>,
                      <PolicyListItem {...this.props} key="g2" primaryText="Sustainable Development Goals" secondaryText="This is a fantastic groovy thing" leftAvatarSrc={logo_g2} onIndicatorSelected={this.indicatorSelected.bind(this)}/>
                    ]}
                    />
                    <PolicyGroupHeader primaryText="Regional" nestedItems={[
                      <PolicyListItem {...this.props} key="r1" primaryText="Framework for Nature Conservation and Protected Areas in the Pacific Islands Region" secondaryText="2014 - 2020" leftAvatarSrc={logo_r1} onIndicatorSelected={this.indicatorSelected.bind(this)} targets={[
                        <div key="t2" primaryText="Objective 3" secondaryText="Identify, conserve, sustainably manage and restore priority sites, habitats and ecosystems, including cultural sites" indicators={[
                          <div id="2" key="2" region={'Pacific'} primaryText="Number of countries logging intact forests" secondaryText="Number of countries logging intact forests" desc="This indicator shows the number of countries that have logged Intact Forest Areas during the last 16 years."/>
                          ]}/>
                
                      ]}/>,
                      <PolicyListItem {...this.props} key="r3" primaryText="Micronesia Challenge" secondaryText="by 2020" leftAvatarSrc={logo_r2} onIndicatorSelected={this.indicatorSelected.bind(this)} targets={[
                        <div key="t2" primaryText="Overall goal" secondaryText="Effectively conserve at least 30% of the near-shore marine resources and 20% of the terrestrial resources across Micronesia by 2020"/>
                      ]}/>,
                      <PolicyListItem {...this.props} key="r2" primaryText="Larger than Elephants" secondaryText="EU Strateic Approach" leftAvatarSrc={logo_r3} onIndicatorSelected={this.indicatorSelected.bind(this)} targets={[
                        <div key="t3" primaryText="Objective 3" secondaryText="Identify, conserve, sustainably manage and restore priority sites, habitats and ecosystems, including cultural sites" indicators={[
                          <div id="2" key="2" region={'CWAfrica'} primaryText="Number of countries logging intact forests in Central and Western Africa" secondaryText="Number of countries logging intact forests" desc="This indicator shows the number of countries that have logged Intact Forest Areas during the last 16 years."/>,
                          <div id="3" key="3" region={'ESAfrica'} primaryText="Number of countries logging intact forests in Southern and Eastern Africa" secondaryText="Number of countries logging intact forests" desc="This indicator shows the number of countries that have logged Intact Forest Areas during the last 16 years."/>
                          ]}/>
                
                      ]}/>                      
                    ]}
                    />
                    <PolicyGroupHeader primaryText="National" nestedItems={[
                      <PolicyListItem {...this.props} key="n1" primaryText="Fiji National Biodiversity Strategy and Action Plan" secondaryText="2017-2030" leftAvatarSrc={logo_fji} onIndicatorSelected={this.indicatorSelected.bind(this)} targets={[
                        <div key="t11" primaryText="Focus Area 2: Developing Protected Areas" secondaryText="CBD Aichi Target 11 implementation in Fiji" indicators={[
                          <div id="0" key="0" iso3={'FJI'} primaryText="Terrestrial protected area coverage" secondaryText="Total area of representative coverage of formally and informally recognised terrestrial protected areas and locally managed areas."/>,
                          <div id="1" key="1" iso3={'FJI'} primaryText="Marine protected area coverage" secondaryText="Total area of representative coverage of formally and informally recognised marine protected areas and locally managed areas."/>
                          ]}/>,
                        <div key="t12" primaryText="Focus Area 3: Species Management" secondaryText="CBD Aichi Target 12 implementation in Fiji" indicators={[
                          <div id="0" key="0" iso3={'FJI'} primaryText="Increased trend in distribution" secondaryText="Increased trend in distribution of the 10 selected plant and animal species"/>,
                          <div id="1" key="1" iso3={'FJI'} primaryText="Increased trend in population" secondaryText="Increased trend in population of the 10 selected plant and animal species"/>
                          ]}/>
                      ]}/>,
                      <PolicyListItem {...this.props} key="n3" primaryText="Papua New Guinea National Biodiversity Strategy and Action Plan" secondaryText="2017-2030" leftAvatarSrc={logo_png} onIndicatorSelected={this.indicatorSelected.bind(this)} targets={[
                        <div key="t11" primaryText="CBD Target 11" secondaryText="By 2020, at least 17 per cent of terrestrial and inland water areas and 10 per cent of coastal and marine areas, especially areas of particular importance for biodiversity and ecosystem services, are conserved through effectively and equitably managed, ecologically representative and well-connected systems of protected areas and other effective area-based conservation measures, and integrated into the wider landscape and seascape." indicators={[
                          <div id="0" key="0" iso3={'PNG'} primaryText="Terrestrial protected area coverage" secondaryText="The total non-overlapping area of terrestrial protected areas"/>,
                          <div id="1" key="1" iso3={'PNG'} primaryText="Marine protected area coverage" secondaryText="The total non-overlapping area of marine protected areas"/>
                          ]}/>
                      ]}/>,
                      <PolicyListItem {...this.props} key="n2" primaryText="Solomon Islands National Biodiversity Strategy and Action Plan" secondaryText="This is a fantastic groovy thing" leftAvatarSrc={logo_slb} onIndicatorSelected={this.indicatorSelected.bind(this)} targets={[
                        <div key="t11" primaryText="CBD Target 11" secondaryText="By 2020, at least 17 per cent of terrestrial and inland water areas and 10 per cent of coastal and marine areas, especially areas of particular importance for biodiversity and ecosystem services, are conserved through effectively and equitably managed, ecologically representative and well-connected systems of protected areas and other effective area-based conservation measures, and integrated into the wider landscape and seascape." indicators={[
                          <div id="0" key="0" iso3={'SLB'} primaryText="Terrestrial protected area coverage" secondaryText="The total non-overlapping area of terrestrial protected areas"/>,
                          <div id="1" key="1" iso3={'SLB'} primaryText="Marine protected area coverage" secondaryText="The total non-overlapping area of marine protected areas"/>
                          ]}/>
                      ]}/>
                    ]}
                    />
                    <PolicyGroupHeader primaryText="Local" nestedItems={[
                      <PolicyListItem {...this.props} key="l1" primaryText="O Le Pupū Puē National Park" secondaryText="IUCN Green List Candidate" leftAvatarSrc={greenListLogo} onIndicatorSelected={this.indicatorSelected.bind(this)} targets={[
                        <div id="" key="t1" primaryText="Maintain biodiversity" secondaryText="" indicators={[
                          <div id="15" key="3" wdpaid="555625771" primaryText="Ramsar species assessment" secondaryText="Total number of species"/>,
                          <div id="15" key="11" wdpaid="555625771" primaryText="GBIF taxon observations" secondaryText="Proportion of occurrence"/>
                          ]}/>,
                        <div key="t1" primaryText="Sound design and planning" secondaryText="" indicators={[
                          <div id="15" key="5" wdpaid="555625771" primaryText="IMET Species Indicator" secondaryText="The total number of bunnies"/>,
                          <div id="15" key="6" wdpaid="555625771" primaryText="IMET Threat Assessment" secondaryText="The level of bad things happening"/>
                          ]}/>,
                        <div key="t1" primaryText="Good governance" secondaryText="" indicators={[
                          <div id="15" key="7" wdpaid="555625771" primaryText="IMET Species Indicator" secondaryText="The total number of bunnies"/>,
                          <div id="15" key="8" wdpaid="555625771" primaryText="IMET Threat Assessment" secondaryText="The level of bad things happening"/>
                          ]}/>          
                      ]}/>,
                      <PolicyListItem {...this.props} key="l2" primaryText="Ngiri-Tumba-Maindombe NP" secondaryText="Management Plan" leftAvatarSrc={logo_l1} onIndicatorSelected={this.indicatorSelected.bind(this)} targets={[
                        <div key="t1" primaryText="Objective 1" secondaryText="Increase management effectiveness" indicators={[
                          <div id="15" key="9" wdpaid="478028" primaryText="IMET Species Indicator" secondaryText="The total number of bunnies"/>,
                          <div id="15" key="10" wdpaid="478028" primaryText="IMET Threat Assessment" secondaryText="The level of bad things happening"/>
                          ]}/>
                      ]}/>
                    ]}
                    />
                </List>
                <PanelLowerToolbar/>
            </React.Fragment>
    );
  }
}

export default PoliciesPanel;
