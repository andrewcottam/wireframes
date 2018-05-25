import * as React from 'react';
import { Tooltip, LineChart, Line, XAxis, YAxis } from 'recharts';
import CBD11Tooltip from './CBD11Tooltip.js';

class TimeSeriesChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = { yr: null };
        this.props.map && this.props.map.on('style.load', this.filterMap.bind(this, 3000)); //filter out features up to the present
        window.addEventListener('keydown', this.handleKeyDown.bind(this)); //attach event handler for the key down event
    }

    componentWillReceiveProps(nextProps) {
        if ((this.props.data.length === 0) && (nextProps.data.length > 0)) { //if the data has been received asyncronously for the country then we can set the year to the latest year with new protected areas
            this.setYear(nextProps.data[nextProps.data.length - 1][this.props.xDataKey]);
        }
    }

    shouldComponentUpdate(nextProps, nextState) { //do not re-render the component if the year is the same as the previous year 
        return nextState.yr !== this.state.yr;
    }

    handleKeyDown(e) {
        let direction = (e.keyCode === 39) ? true : e.keyCode === 37 ? false : null; //37 is the left arrow 39 is right arrow 
        e.target.className !== "mapboxgl-canvas" && direction !== null && this.changeYear(direction);
    }

    changeYear(up) {
        let currentIndex = this.props.data.findIndex(function(currentValue, index, arr) {
            return currentValue.x === this.state.yr;
        }, this);
        let newIndex = up ? currentIndex < this.props.data.length - 1 ? currentIndex + 1 : currentIndex : currentIndex > 0 ? currentIndex - 1 : currentIndex;
        this.setYear(this.props.data[newIndex].x);
    }

    mouseMove(e) {
        if (e && e.activeLabel) {
            this.setYear(e.activeLabel);
        }
    }
    setYear(yr) {
        this.filterMap(yr);
        this.setState({ yr: yr });
    }

    filterMap(yr) {
        //get the map filter expressions from the calling component
        let filterExpressions = this.props.getFilterExpressions(yr);
        //iterate through the map filter expressions and apply them
        filterExpressions.map((expression) => {
            this.props.map.setFilter(expression.layer, expression.expression);
        });
    }
    render() {
        return (
            <React.Fragment>
                <div style={{paddingLeft:'41px'}}>Up to {this.state.yr}</div>
                <LineChart {...this.props} onMouseMove={this.mouseMove.bind(this)} width={400} height={300}> 
                    <XAxis scale={this.props.scale} dataKey={this.props.xDataKey} domain={this.props.xdomain} label={{value:"Year", position:"insideBottom",style:{fontSize:'11px'},offset:-1}} style={{fontSize:'11px',paddingTop:'20px'}} padding={{ left: 10, right: 10 }}/>
                    <YAxis label={{ value: this.props.yAxisLabel, angle: -90, position: 'inside', style:{fontSize:'11px'}}} style={{fontSize:'11px'}}/>
                    <Tooltip isAnimationActive={false} content={<CBD11Tooltip/>} wrapperStyle={{visibility: 'visible'}} style={{visibility: 'visible'}} active={true}/>
                    <Line type="monotone" dataKey={this.props.yDataKey} stroke="#00BCD4" isAnimationActive={false} dot={{ stroke: '#00BCD4', strokeWidth: 1,r:2 }} connectNulls={true}/>
                </LineChart>
            </React.Fragment>
        );
    }
}
export default TimeSeriesChart;
