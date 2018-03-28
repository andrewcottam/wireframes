import * as React from 'react';
import { Tooltip, LineChart, Line, XAxis, YAxis } from 'recharts';
import CBD11Tooltip from './CBD11Tooltip.js';

class TimeSeriesChart extends React.Component {
  constructor(props){
    super(props);
    this.props.map && this.props.map.on('style.load', this.initialiseMap.bind(this));
  }
     initialiseMap () { 
      this.filterMap(3000);
    };

    mouseMove(e) {
        if (e && e.activeLabel) {
            this.filterMap(e.activeLabel);
        }
    }
    filterMap(yr) {
        // this.props.map.on('render', this.onSourceData.bind(this, yr));
        this.props.map.setFilter("terrestrial-pas", ["all", ["<", "STATUS_YR", yr],
            ["==", "PARENT_ISO", this.props.country]
        ]);
        this.props.map.setFilter("terrestrial-pas-active", ["all", ["==", "STATUS_YR", yr],
            ["==", "PARENT_ISO", this.props.country]
        ]);
        this.props.map.setFilter("terrestrial-pas-labels", ["all", ["==", "STATUS_YR", yr],
            ["==", "PARENT_ISO", this.props.country]
        ]);
        this.props.map.setFilter("marine-pas", ["all", ["<", "STATUS_YR", yr],
            ["==", "PARENT_ISO", this.props.country]
        ]);
        this.props.map.setFilter("marine-pas-active", ["all", ["==", "STATUS_YR", yr],
            ["==", "PARENT_ISO", this.props.country]
        ]);
        this.props.map.setFilter("marine-pas-labels", ["all", ["==", "STATUS_YR", yr],
            ["==", "PARENT_ISO", this.props.country]
        ]);
    }
    render() {
        return (
            <LineChart {...this.props} onMouseMove={this.mouseMove.bind(this)}>
              <XAxis scale="linear" dataKey="x" domain={this.props.xdomain} label={{value:"Year", position:"insideBottom",style:{fontSize:'11px'},offset:-1}} style={{fontSize:'11px',paddingTop:'20px'}} padding={{ left: 10, right: 10 }}/>
              <YAxis label={{ value: '% protected', angle: -90, position: 'inside', style:{fontSize:'11px'}}} style={{fontSize:'11px'}}/>
              <Tooltip isAnimationActive={false} content={<CBD11Tooltip/>}/>
              <Line type="monotone" dataKey="threshold" stroke="#d0d0d0" isAnimationActive={false} dot={false} connectNulls={true}/>
              <Line type="monotone" dataKey="percent" stroke="#00BCD4" isAnimationActive={false} dot={{ stroke: '#00BCD4', strokeWidth: 1,r:2 }} connectNulls={true}/>
            </LineChart>
        );
    }
}
export default TimeSeriesChart;
