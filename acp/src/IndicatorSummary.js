import * as React from 'react';
import Divider from 'material-ui/Divider';
import { Sparklines, SparklinesLine, SparklinesSpots, SparklinesReferenceLine } from 'react-sparklines';

class IndicatorSummary extends React.Component {
    render() {
        let data = this.props.data;
        let sparkline = (data.length ? 
            <Sparklines data={data}>
                <SparklinesLine />
                <SparklinesSpots />
                <SparklinesReferenceLine type={this.props.line} />
            </Sparklines>
        : <div style={{fontSize:'12px'}}><i className="fas fa-exclamation-circle" style={{color:'red',padding:'0px 5px'}}></i>No trend data available</div>);
        return (
            <div className="IndicatorSummary">
                <div className="IndicatorSummaryTitle">{this.props.title}
            </div>
            <Divider/>
            <div className="sparklineDiv">
                {sparkline}
            </div>
        </div> );
    }
}

export default IndicatorSummary;
