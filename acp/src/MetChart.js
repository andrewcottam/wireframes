import * as React from 'react';
import { PieChart, Pie, Cell } from 'recharts';
import Divider from 'material-ui/Divider';

class MetChart extends React.Component {
    onClick(e) {
        if (this.props.clickable !== false) {
            this.props.onClick(this);
        }
    }
    render() {
        const data = [{ name: 'Not met', value: (100 - this.props.percentMet) }, { name: 'Met', value: this.props.percentMet }];
        const colors = ['#D9D9D9', this.props.color];
        return (
            <React.Fragment>
                <div className="MetChart">
                    <div className="MetChartTitle">{this.props.title}</div>
                    <Divider/>
                    <div className='MetChartInner'>
                        <PieChart width={120} height={120}>
                            <Pie data={data} isAnimationActive={false} innerRadius={30} outerRadius={50} startAngle={90} endAngle={450} dataKey="value">
                                {data.map((entry, index) => <Cell fill={colors[index % colors.length]} key={index} strokeWidth={2}/>)}
                            </Pie>
                        </PieChart>
                        <div className="MetChartDiv" style={this.props.clickable!==false ? {cursor: 'pointer'} : null}title={this.props.clickable!==false ? "Click for more detail" : null} onClick={this.onClick.bind(this)}>
                            <div style={{color:colors[1]}} className="MetChartPercentLabel">
                                {this.props.percentMet}%
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default MetChart;
