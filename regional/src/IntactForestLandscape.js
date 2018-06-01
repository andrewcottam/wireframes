import * as React from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';
import TimeSeriesChart from './TimeSeriesChart.js';
import { CardText } from 'material-ui/Card';
import * as jsonp from 'jsonp';

class IntactForestLandscape extends React.Component {
    constructor(props) {
        super(props);
        this.state = { data: [], xdomain: [] };
    }
    componentDidMount() {
        let ENDPOINT = "https://db-server-blishten.c9users.io/cgi-bin/services.py/biopama/services/get_ifl_logged_areas?ifl_id=" + this.props.ifl_id;
        jsonp(ENDPOINT, this.parseData.bind(this)); //get the data from the server and parse it
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if ((prevProps.ifl_id !== this.props.ifl_id)) {
            let ENDPOINT = "https://db-server-blishten.c9users.io/cgi-bin/services.py/biopama/services/get_ifl_logged_areas?ifl_id=" + this.props.ifl_id;
            jsonp(ENDPOINT, this.parseData.bind(this)); //get the data from the server and parse it
        }
    }
    parseData(err, response) {
        if (err) throw err;
        let allyears = response.records.map((item) => {
            return { x: item.yr, y: item.area };
        });
        this.setState({ data: allyears });
    }

    parseAllData(err, response) {
        if (err) throw err;
        this.setState({ alldata: response.records });
    }

    getFilterExpressions(yr) {
        let filterExpressions = [];
        if (this.state.alldata) {
            //get the filter expressions to pass to the time series chart
            filterExpressions = [
                { layer: "Intact Forest 2013", expression: ["in", "IFL_ID", this.props.ifl_id] }
            ];
        }
        else {
            //the data has not been initialised so hide the country boundaries and show the intact forest landscapes for the year
            filterExpressions = [
                { layer: "gaul", expression: ["in", "iso3", "ZZZ"] },
                { layer: "gaul-2015-simplified", expression: ["in", "iso3", "ZZZ"] }
            ];
        }
        return filterExpressions;
    }

    render() {
        return (
            <Tabs        
        value="Province"
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
          disabled={true}
          buttonStyle={{height:'25px',padding:'3px 0px 3px 0px',backgroundColor:'#d0d0d0'}}
          style={{fontSize:'12px'}}
          >
          {this.props.country ? 
          <div
            style={{padding:'12px',fontSize:'19px'}}>
            {this.props.country} Intact Forest Landscapes logged in the last 16 years
          </div> : null }
        </Tab>                  
        <Tab 
          label="PA" 
          value="Province"
          buttonStyle={{height:'25px',padding:'3px 0px 3px 0px'}}
          style={{fontSize:'12px'}}
          >
            <React.Fragment>
            <TimeSeriesChart 
              width={400} 
              height={200} 
              data={this.state.data} 
              margin={{ top: 25, right: 15, bottom: 25, left: 15 }} {...this.props} 
              xdomain={this.state.xdomain} 
              xDataKey={'x'} 
              xdomain={[2001,2016]}
              yDataKey={'y'} 
              yAxisLabel={'Area logged'}
              getFilterExpressions={this.getFilterExpressions.bind(this)}
            />
            <CardText 
              style={{padding:'12px',fontSize:'13px'}}>{this.props.desc ? this.props.desc : "Move the mouse over the chart to filter by year."}
            </CardText>
          </React.Fragment>
        </Tab>
     </Tabs>
        );
    }
}

export default IntactForestLandscape;
