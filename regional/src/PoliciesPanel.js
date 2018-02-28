import * as React from 'react';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import logo_g1 from './logo-g1.png';
import logo_g2 from './logo-g2.png';
import logo_r1 from './logo-r1.png';
import logo_fji from './logo-fji.png';
import logo_slb from './logo-slb.png';
import logo_l1 from './logo-l1.png';
import greenListLogo from './Green-List-logo-1.png';
import { List, ListItem } from 'material-ui/List';
import PolicyListItem from './PolicyListItem.js';
import Paper from 'material-ui/Paper';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

function PolicyGroupHeader(props) {
    return (
        <ListItem primaryText={props.primaryText} primaryTogglesNestedList={true} nestedItems={props.nestedItems}/>
    );
}

function PanelLowerToolbar(props) {
    return (
        <Paper className="panelLowerPaper" zDepth={1}>
            <AddDrupalItem title="Add Indicator"/>
        </Paper>
    );
}

function AddDrupalItem(props) {
    return (
        <FloatingActionButton mini={true} secondary={true} className="addDrupalItem" title={props.title}>
            <ContentAdd />
        </FloatingActionButton>
    );
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
                      <PolicyListItem key="g1" primaryText="Convention on Biological Diversity" secondaryText="Strategic Plan for Biodiversity 2011-2020" leftAvatarSrc={logo_g1} onIndicatorSelected={this.indicatorSelected.bind(this)} targets={[
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
            </React.Fragment>
        );
    }
}

export default PoliciesPanel;
