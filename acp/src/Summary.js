import * as React from 'react';
import Header from './Header.js';
import Header2 from './Header2.js';
import MetChart from './MetChart.js';

const regions = ['Caribbean', 'C and W Africa', 'E and S Africa', 'Pacific'];

class Summary extends React.Component {
    onClickMetChart(e) {
        this.props.history.push({
            pathname: window.basepath + "Region/" + e.props.title
        });
    }
    render() {
        return (
            <React.Fragment>
                <Header title="ACP Summary"/>
                <Header2 title="Proportion of regional targets met"/>
                <div style={{margin:'20px'}}>
                    {regions.map((item,index)=><MetChart percentMet={window.percentages[index]} color={window.colors[index]} title={item} key={index} onClick={this.onClickMetChart.bind(this)}/>)}
                </div>
            </React.Fragment>
        );
    }
}

export default Summary;
