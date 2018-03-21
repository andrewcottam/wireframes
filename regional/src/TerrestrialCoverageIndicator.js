import * as React from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';
import TimeSeriesChart from './TimeSeriesChart.js';
import { CardText } from 'material-ui/Card';
import * as jsonp from 'jsonp';

const TZA_DATA = [{ "iso3": "TZA", "yr": 1905, "new_area": 41306.61, "cum_area": 226275.93 }, { "iso3": "TZA", "yr": 1931, "new_area": 4.42, "cum_area": 226280.35 }, { "iso3": "TZA", "yr": 1935, "new_area": 9.47, "cum_area": 226289.81 }, { "iso3": "TZA", "yr": 1937, "new_area": 120.9, "cum_area": 226410.72 }, { "iso3": "TZA", "yr": 1940, "new_area": 155.14, "cum_area": 226565.86 }, { "iso3": "TZA", "yr": 1941, "new_area": 20.45, "cum_area": 226586.3 }, { "iso3": "TZA", "yr": 1947, "new_area": 86.4, "cum_area": 226672.7 }, { "iso3": "TZA", "yr": 1949, "new_area": 41.58, "cum_area": 226714.29 }, { "iso3": "TZA", "yr": 1950, "new_area": 42.34, "cum_area": 226756.63 }, { "iso3": "TZA", "yr": 1951, "new_area": 16602.08, "cum_area": 243358.71 }, { "iso3": "TZA", "yr": 1952, "new_area": 28.49, "cum_area": 243387.19 }, { "iso3": "TZA", "yr": 1953, "new_area": 655.83, "cum_area": 244043.02 }, { "iso3": "TZA", "yr": 1954, "new_area": 1434.97, "cum_area": 245477.98 }, { "iso3": "TZA", "yr": 1955, "new_area": 5713.38, "cum_area": 251191.37 }, { "iso3": "TZA", "yr": 1956, "new_area": 1958.83, "cum_area": 253150.19 }, { "iso3": "TZA", "yr": 1957, "new_area": 2769.41, "cum_area": 255919.61 }, { "iso3": "TZA", "yr": 1958, "new_area": 7706.86, "cum_area": 263626.46 }, { "iso3": "TZA", "yr": 1959, "new_area": 8.42, "cum_area": 263634.88 }, { "iso3": "TZA", "yr": 1960, "new_area": 408.22, "cum_area": 264043.1 }, { "iso3": "TZA", "yr": 1961, "new_area": 118.23, "cum_area": 264161.33 }, { "iso3": "TZA", "yr": 1962, "new_area": 999.73, "cum_area": 265161.06 }, { "iso3": "TZA", "yr": 1963, "new_area": 375.93, "cum_area": 265536.98 }, { "iso3": "TZA", "yr": 1964, "new_area": 17881.33, "cum_area": 283418.31 }, { "iso3": "TZA", "yr": 1965, "new_area": 1117.04, "cum_area": 284535.35 }, { "iso3": "TZA", "yr": 1966, "new_area": 46.28, "cum_area": 284581.63 }, { "iso3": "TZA", "yr": 1967, "new_area": 31.89, "cum_area": 284613.52 }, { "iso3": "TZA", "yr": 1968, "new_area": 34.54, "cum_area": 284648.06 }, { "iso3": "TZA", "yr": 1969, "new_area": 14696.28, "cum_area": 299344.34 }, { "iso3": "TZA", "yr": 1970, "new_area": 2607.12, "cum_area": 301951.46 }, { "iso3": "TZA", "yr": 1972, "new_area": 5099.41, "cum_area": 307050.86 }, { "iso3": "TZA", "yr": 1973, "new_area": 1712.62, "cum_area": 308763.48 }, { "iso3": "TZA", "yr": 1974, "new_area": 7505.8, "cum_area": 316269.29 }, { "iso3": "TZA", "yr": 1975, "new_area": 2.42, "cum_area": 316271.71 }, { "iso3": "TZA", "yr": 1977, "new_area": 212.31, "cum_area": 316484.02 }, { "iso3": "TZA", "yr": 1979, "new_area": 69.29, "cum_area": 316553.31 }, { "iso3": "TZA", "yr": 1980, "new_area": 1471.51, "cum_area": 318024.81 }, { "iso3": "TZA", "yr": 1981, "new_area": 0.53, "cum_area": 318025.34 }, { "iso3": "TZA", "yr": 1982, "new_area": 6167.37, "cum_area": 324192.71 }, { "iso3": "TZA", "yr": 1987, "new_area": 0, "cum_area": 324192.71 }, { "iso3": "TZA", "yr": 1988, "new_area": 28.73, "cum_area": 324221.45 }, { "iso3": "TZA", "yr": 1992, "new_area": 1965.63, "cum_area": 326187.08 }, { "iso3": "TZA", "yr": 1993, "new_area": 1027.06, "cum_area": 327214.14 }, { "iso3": "TZA", "yr": 1994, "new_area": 9.86, "cum_area": 327224 }, { "iso3": "TZA", "yr": 1995, "new_area": 245.73, "cum_area": 327469.73 }, { "iso3": "TZA", "yr": 1997, "new_area": 96.37, "cum_area": 327566.1 }, { "iso3": "TZA", "yr": 1998, "new_area": 0, "cum_area": 327566.1 }, { "iso3": "TZA", "yr": 2000, "new_area": 12068.25, "cum_area": 339634.36 }, { "iso3": "TZA", "yr": 2001, "new_area": 43.84, "cum_area": 339678.2 }, { "iso3": "TZA", "yr": 2002, "new_area": 1692.29, "cum_area": 341370.49 }, { "iso3": "TZA", "yr": 2004, "new_area": 716.48, "cum_area": 342086.97 }, { "iso3": "TZA", "yr": 2005, "new_area": 180.21, "cum_area": 342267.18 }, { "iso3": "TZA", "yr": 2006, "new_area": 2653.98, "cum_area": 344921.16 }, { "iso3": "TZA", "yr": 2007, "new_area": 6371.5, "cum_area": 351292.66 }, { "iso3": "TZA", "yr": 2009, "new_area": 4902.87, "cum_area": 356195.53 }, { "iso3": "TZA", "yr": 2010, "new_area": 4193.68, "cum_area": 360389.21 }];

class TerrestrialCoverageIndicator extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: [] };
    let ENDPOINT = "https://db-server-blishten.c9users.io/cgi-bin/services.py/biopama/services/get_wdpa_terrestrial_coverage_statistics?iso3code=TZA";
    jsonp(ENDPOINT, this.parseData.bind(this)); //get the data from the server and parse it
  }
  parseData(err, response) {
    if (err) throw err;
    let allyears = response.records.map((item) => {
      return { x: item.yr, cum_area: item.cum_area, percent: (item.cum_area / 9450.87), threshold: 17 };
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
                  {this.props.indicatorTitle ? 
                  <div
                    style={{padding:'12px',fontSize:'19px'}}>
                    {this.props.indicatorTitle}
                  </div> : null }
                  <React.Fragment>
                    <TimeSeriesChart width={400} height={200} data={this.state.data} margin={{ top: 25, right: 15, bottom: 25, left: 15 }} map={this.props.map} xdomain={this.state.xdomain}/>
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
