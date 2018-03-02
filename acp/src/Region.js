import * as React from 'react';
import logo_r1 from './logo-r1.png';
import IndicatorSummary from './IndicatorSummary.js';
import PolicyItem from './PolicyItem.js';
import TargetItem from './TargetItem.js';
import Header from './Header.js';
import Header2 from './Header2.js';
import MetChart from './MetChart.js';

const countries = ['American Samoa', 'Cook Islands', 'Federated States of Micronesia', 'Fiji', 'French Polynesia', 'Guam', 'Kiribati', 'Marshall Islands', 'Nauru', 'New Caledonia', 'Niue', 'North Mariana Islands', 'Palau', 'Papua New Guinea', 'Samoa', 'Solomon Islands', 'Tokelau', 'Tonga', 'Tuvalu', 'Vanuatu', 'Wallis and Futuna'];
const percentages = [35, 25, 12, 23, 4, 6, 19, 5, 25, 16, 28, 20, 12, 6, 11, 5, 32, 25, 33, 39, 13];
const colors = ['#8D228C', '#00B172', '#2B65A5', '#FAB800', '#FF006A', '#5EC461', '#F57E00', '#00899B', '#EA008E', '#FF6A5F', '#504098', '#A2AE9A', '#8D228C', '#00B172', '#2B65A5', '#FAB800', '#FF006A', '#5EC461', '#F57E00', '#00899B', '#EA008E'];

class Region extends React.Component {
    onClickMetChart(e) {
        this.props.history.push({
            pathname: window.basepath + "Country/"  + e.props.title  
        });
    }
    render() {
        return (
            <React.Fragment>
                <Header title={this.props.match.params.region + " Region Summary"}/>
                <Header2 title="Proportion of regional targets met"/>
                <div style={{margin:'30px'}}>                <MetChart percentMet={23} color={colors[3]} key={3} /></div>
                <Header2 title="Regional targets"/>
                <PolicyItem primaryText="Framework for Nature Conservation and Protected Areas in the Pacfic Islands Region" secondaryText="2014-2020" avatar={logo_r1}/>
                <div style={{paddingLeft:'57px'}}>
                    <TargetItem primaryText="Objective 3: Identify, conserve, sustainably manage and restore priority sites, habitats and ecosystems, including cultural sites"/>
                    <IndicatorSummary title="Number of countries logging intact forests" data={[25,20,21,22,22,21,18,14,13,6,5,5,4,4]} line={"mean"} id="2"/>
                </div>
                <Header2 title="Proportion of National targets met"/>
                <div style={{margin:'20px'}}>
                    {countries.map((item,index)=><MetChart percentMet={percentages[index]} color={colors[index]} title={item} onClick={this.onClickMetChart.bind(this)} key={index} drillTo={'Country'}/>)}
                </div>
            </React.Fragment>
        );
    }
}

export default Region;
