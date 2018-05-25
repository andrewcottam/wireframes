import * as React from 'react';
import logo_r1 from './logo-r1.png';
import IndicatorSummary from './IndicatorSummary.js';
import PolicyItem from './PolicyItem.js';
import TargetItem from './TargetItem.js';
import Header from './Header.js';
import Header2 from './Header2.js';
import MetChart from './MetChart.js';

class Region extends React.Component {
    onClickMetChart(e) {
        this.props.history.push({
            pathname: window.basepath + "Country/" + e.props.iso3
        });
    }
    render() {
        let countries, index;
        switch (this.props.match.params.region) {
            case "Caribbean":
                countries = window.caribbean;
                index = 0;
                break;
            case "C and W Africa":
                countries = window.cwafrica;
                index = 1;
                break;
            case "E and S Africa":
                countries = window.esafrica;
                index = 2;
                break;
            case "Pacific":
                countries = window.pacific;
                index = 3;
                break;
            default:
        }
        return (
            <React.Fragment>
                <Header title={this.props.match.params.region + " Region Summary"}/>
                <Header2 title="Proportion of Regional targets met"/>
                <div style={{margin:'20px'}}>                
                    <MetChart title={this.props.match.params.region} percentMet={window.percentages[index]} color={window.colors[index]} key={3} clickable={false} />
                </div>
                <Header2 title="Regional targets"/>
                <PolicyItem primaryText="Framework for Nature Conservation and Protected Areas in the Pacfic Islands Region" secondaryText="2014-2020" avatar={logo_r1}/>
                <div style={{paddingLeft:'57px'}}>
                    <TargetItem primaryText="Objective 3: Identify, conserve, sustainably manage and restore priority sites, habitats and ecosystems, including cultural sites"/>
                    <IndicatorSummary title="Number of countries logging intact forests" data={[25,20,21,22,22,21,18,14,13,6,5,5,4,4]} line={"mean"} id="2"/>
                </div>
                <Header2 title="Proportion of Country targets met"/>
                <div style={{margin:'20px'}}>
                    {countries.map((item,index)=><MetChart percentMet={window.percentages[index]} color={window.colors[index]} title={item.name} onClick={this.onClickMetChart.bind(this)} key={index} drillTo={'Country'} iso3={item.iso3}/>)}
                </div>
            </React.Fragment>
        );
    }
}

export default Region;
