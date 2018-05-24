import * as React from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';
import TimeSeriesChart from './TimeSeriesChart.js';
import { CardText } from 'material-ui/Card';
import * as jsonp from 'jsonp';

class TerrestrialCoverageIndicator extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: [], xdomain: [] }; 
    let ENDPOINT = "https://db-server-blishten.c9users.io/cgi-bin/services.py/biopama/services/get_wdpa_terrestrial_coverage_statistics?iso3code="  + this.props.country;
    jsonp(ENDPOINT, this.parseData.bind(this)); //get the data from the server and parse it
  }
  parseData(err, response) {
    if (err) throw err;
    let countryArea = response.records && response.records[0] && response.records[0].country_area;
    let allyears = response.records.map((item) => {
      return { x: item.yr, cum_area: item.cum_area, percent: (item.cum_area / (countryArea/100000000)), threshold: 17 };
    });
    let xstart = (allyears[0].x === 0) ? allyears[1].x : allyears[0].x;
    let xend = 2018;
    allyears = (allyears[0].x === 0) ? allyears.slice(1) : allyears;
    this.setState({ data: allyears, xdomain: [xstart, xend] });
  }
  
  render() {
    return (
      <Tabs        
        value="Country"
        onChange={this.handleChange}
        >
        <Tab 
          label="Indicator" 
          value="Indicator"
          disabled={true}
          buttonStyle={{height:'25px',padding:'3px 0px 3px 0px',backgroundColor:'#d0d0d0'}}
          style={{fontSize:'12px'}}
          >
        </Tab>
        <Tab 
          label="Region" 
          value="Region"
          disabled={true}
          buttonStyle={{height:'25px',padding:'3px 0px 3px 0px',backgroundColor:'#d0d0d0'}}
          style={{fontSize:'12px'}}
          />
        <Tab 
          label="Country" 
          value="Country" 
          buttonStyle={{height:'25px',padding:'3px 0px 3px 0px'}}
          style={{fontSize:'12px'}}
          >
          {this.props.country ? 
          <div
            style={{padding:'12px',fontSize:'19px'}}>
            {this.props.country}  terrestrial protected area coverage
          </div> : null }
          <React.Fragment>
            <TimeSeriesChart width={400} height={200} data={this.state.data} margin={{ top: 25, right: 15, bottom: 25, left: 15 }} {...this.props} xdomain={this.state.xdomain} xDataKey={'x'} yDataKey={'percent'} scale={'linear'}/>
            <CardText 
              style={{padding:'12px',fontSize:'13px'}}>{this.props.desc ? this.props.desc : "Move the mouse over the chart to see the change in protection through time."}
            </CardText>
          </React.Fragment>
        </Tab>                  
        <Tab 
          label="Province" 
          value="Province"
          disabled={true}
          buttonStyle={{height:'25px',padding:'3px 0px 3px 0px',backgroundColor:'#d0d0d0'}}
          style={{fontSize:'12px'}}
          />
     </Tabs>
    );
  }
}

export default TerrestrialCoverageIndicator;
