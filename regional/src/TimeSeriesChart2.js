import * as React from 'react';
import { Tooltip, LineChart, Line, XAxis, YAxis } from 'recharts';
import CBD11Tooltip from './CBD11Tooltip.js';

class TimeSeriesChart2 extends React.Component {
    mouseMove(e) {
        if (e && e.activeLabel) {
            this.filterMap(e.activeLabel);
        }
    }
    render() {
        return (
            <LineChart {...this.props} >
              <XAxis scale="linear" dataKey="x" domain={[1995, 2015]} label={{value:"Year", position:"insideBottom",style:{fontSize:'11px'},offset:-1}} style={{fontSize:'11px',paddingTop:'20px'}} ticks={[1995,2000,2005,2010,2015]}  padding={{ left: 10, right: 10 }}/>
              <YAxis label={{ value: 'number of countries', angle: -90, position: 'inside', style:{fontSize:'11px'}}} style={{fontSize:'11px'}}/>
              <Tooltip isAnimationActive={false} content={<CBD11Tooltip/>}/>
              <Line type="monotone" dataKey="y" stroke="#00BCD4" isAnimationActive={false} dot={{ stroke: '#00BCD4', strokeWidth: 1,r:2 }} connectNulls={true}/>
            </LineChart>
        );
    }
}
export default TimeSeriesChart2;
