import * as React from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';
import TimeSeriesChart3 from './TimeSeriesChart3.js';
import { CardText } from 'material-ui/Card';
import * as jsonp from 'jsonp';

class TerrestrialCoverageIndicatorGlobal extends React.Component {
    constructor(props) {
        super(props);
        this.state = { data: [], xdomain: [], alldata: [] };
        let domain = this.props.terrestrial ? "terrestrial" : "marine";
        let ENDPOINT = "https://db-server-blishten.c9users.io/cgi-bin/services.py/biopama/services/get_" + domain + "_coverage_analysis?format=json";
        jsonp(ENDPOINT, this.parseData.bind(this)); //get the data from the server and parse it
        ENDPOINT = "https://db-server-blishten.c9users.io/cgi-bin/services.py/biopama/services/get_" + domain + "_coverage_analysis2?format=json";
        jsonp(ENDPOINT, this.parseAllData.bind(this)); //get the data including the country iso3 code and the year
    }
    parseData(err, response) {
        if (err) throw err;
        let xstart = 1948;
        let xend = 2016;
        this.setState({ data: response.records.slice(2), xdomain: [xstart, xend] });
    }

    parseAllData(err, response) {
        if (err) throw err;
        this.setState({ alldata: response.records });
    }

    render() {
        return (
            <Tabs        
                value="Indicator"
                onChange={this.handleChange}
                >
                <Tab 
                  label="Indicator" 
                  value="Indicator"
                  buttonStyle={{height:'25px',padding:'3px 0px 3px 0px'}}
                  style={{fontSize:'12px'}}
                  >
                  <div
                    style={{padding:'12px',fontSize:'19px'}}>
                    Countries achieving the CBD 11 terrestrial coverage target
                  </div> 
                  <React.Fragment>
                    <TimeSeriesChart3 width={400} height={200} data={this.state.data} margin={{ top: 25, right: 15, bottom: 25, left: 15 }} {...this.props} xdomain={this.state.xdomain} xDataKey={'yr'} yDataKey={'num'} scale={'linear'} alldata={this.state.alldata}/>
                    <CardText 
                      style={{padding:'12px',fontSize:'13px'}}>{this.props.desc ? this.props.desc : "Move the mouse over the chart to see the change in protection through time."}
                    </CardText>
                  </React.Fragment>
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
                  buttonStyle={{height:'25px',padding:'3px 0px 3px 0px',backgroundColor:'#d0d0d0'}}
                  style={{fontSize:'12px'}}
                  disabled={true}
                  />
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

export default TerrestrialCoverageIndicatorGlobal;
