import * as React from 'react';
import Header from './Header.js';
import Header2 from './Header2.js';
import MetChart from './MetChart.js';

const regions = ['C and W Africa', 'E and S Africa', 'Caribbean', 'Pacific'];
const percentages = [35, 25, 12, 23, 4, 6, 19, 5, 25, 16, 28, 20, 12, 6, 11, 5, 32, 25, 33, 39, 13];
const colors = ['#8D228C', '#00B172', '#2B65A5', '#FAB800', '#FF006A', '#5EC461', '#F57E00', '#00899B', '#EA008E', '#FF6A5F', '#504098', '#A2AE9A', '#8D228C', '#00B172', '#2B65A5', '#FAB800', '#FF006A', '#5EC461', '#F57E00', '#00899B', '#EA008E'];

class Summary extends React.Component {
    onClickMetChart(e) {
        this.props.history.push({
            pathname: "/wireframes/acp/Region/"+ e.props.title
        });
    }
    render() {
        return (
            <React.Fragment>
                <Header title="ACP Summary"/>
                <Header2 title="Proportion of regional targets met"/>
                <div style={{margin:'20px'}}>
                    {regions.map((item,index)=><MetChart percentMet={percentages[index]} color={colors[index]} title={item} key={index} onClick={this.onClickMetChart.bind(this)}/>)}
                </div>
            </React.Fragment>
        );
    }
}

export default Summary;
