import * as React from 'react';
import logo_g1 from './logo-g1.png';
import logo_g2 from './logo-g2.png';
import logo_tza from './logo-tza.png';
import IndicatorSummary from './IndicatorSummary.js';
import PolicyItem from './PolicyItem.js';
import TargetItem from './TargetItem.js';
import Header from './Header.js';

class Country extends React.Component {
    render() {
        return (
            <React.Fragment>
              <Header title={this.props.match.params.country + " Country Summary"}/>
              <PolicyItem primaryText="Convention on Biological Diversity" avatar={logo_g1} secondaryText="Strategic Plan for Biodiversity 2011-2020"/>
              <div style={{paddingLeft:'57px'}}>
                <TargetItem primaryText="Target 11: By 2020, at least 17 per cent of terrestrial and inland water areas and 10 per cent of coastal and marine areas, especially areas of particular importance for biodiversity and ecosystem services, are conserved through effectively and equitably managed, ecologically representative and well-connected systems of protected areas and other effective area-based conservation measures, and integrated into the wider landscape and seascape."/>
                <IndicatorSummary title="Terrestrial protected area coverage" data={[5, 10, 11, 12,12,13,16, 17, 17, 19, 22,21]} line={"mean"}/>
                <IndicatorSummary title="Marine protected area coverage" data={[5, 5, 5, 4,8,8,9, 10, 11, 12, 12,11]} line={"mean"}/>
              </div>
              <PolicyItem primaryText="Sustainable Development Goals" avatar={logo_g2} secondaryText="17 goals to transform our world and make it groovy"/>
              <div style={{paddingLeft:'57px'}}>
                <TargetItem primaryText="Target 15: Sustainably manage forests, combat desertification, halt and reverse land degradation, halt biodiversity loss"/>
                <IndicatorSummary title="Number of provinces that have ceased logging intact forest"  data={[7,7,8,9,9,8,7,10,9,11]}/>
                <IndicatorSummary title="Species extinctions"  data={[0,0,1,0,0,0,0,1,0,0,2,0,0]}/>
              </div>
              <PolicyItem primaryText="Tanzania National Biodiversity Strategy and Action Plan" avatar={logo_tza} secondaryText="National NBSAP"/>
              <div style={{paddingLeft:'57px'}}>
                <TargetItem primaryText="Target 10: By 2020, the multiple anthropogenic pressure on coral reef, and vulnerable ecosystems impacted by climatic change are minimized."/>
                <IndicatorSummary title="Incidence of dynamite fishing"  data={[19,15,12,12,11,13,10,9,5,5,5,4]}/>
                <IndicatorSummary title="Coral area removed for constuction"  data={[40,10,3,3,3,2,1,3]}/>
                <IndicatorSummary title="Total area of coral bleached per annum" data={[]}/>
                <IndicatorSummary title="Coral area removed for constuction" data={[40,10,3,3,3,2,1,3]}/>
              </div>
            </React.Fragment>
        );
    }
}

export default Country;
