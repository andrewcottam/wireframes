import * as React from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';
import TimeSeriesChart from './TimeSeriesChart.js';
import { CardText } from 'material-ui/Card';
import * as jsonp from 'jsonp';

class IntactForestCountry extends React.Component {
    constructor(props) {
        super(props);
        this.state = { data: [], xdomain: [] };
    }
    componentWillMount() {
        if (this.props.map) {
            this.props.map.on("click", this.mapClick.bind(this));
        }
    }
    componentWillUnmount() {
        this.props.map.off("click", this.mapClick.bind(this));
    }
    mapClick(e) {
        var features = e.target.queryRenderedFeatures(e.point);
        let iflFeatures = features.filter((f) => ['Intact Forest 2013'].indexOf(f.layer.id) > -1);
        if (iflFeatures.length > 0) {
            let idl_id = iflFeatures[0].properties.IFL_ID;
            this.props.history.push({
                pathname: window.basepath + "indicator/14/" + idl_id
            });
        }
    }
    componentDidMount() {
        let ENDPOINT = "https://db-server-blishten.c9users.io/cgi-bin/services.py/biopama/services/get_ifl_logged_by_year_count?iso3=" + this.props.country;
        jsonp(ENDPOINT, this.parseData.bind(this)); //get the data from the server and parse it
        ENDPOINT = "https://db-server-blishten.c9users.io/cgi-bin/services.py/biopama/services/get_ifl_logged_by_year?format=json";
        jsonp(ENDPOINT, this.parseAllData.bind(this)); //get the data from the server and parse it
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if ((prevProps.country !== this.props.country) || (prevProps.marine !== this.props.marine)) {
            let ENDPOINT = "https://db-server-blishten.c9users.io/cgi-bin/services.py/biopama/services/get_ifl_logged_by_year_count?iso3=" + this.props.country;
            jsonp(ENDPOINT, this.parseData.bind(this)); //get the data from the server and parse it
        }
    }
    parseData(err, response) {
        if (err) throw err;
        let allyears = response.records.map((item) => {
            return { x: item._year, y: item._count };
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
            //get the min-max values for the country
            let countryValues = this.state.alldata.filter(function(item) {
                return (item.country === this.props.country);
            }, this);
            //get the max value for the area logged for the country
            let maxArea = Math.max.apply(Math, countryValues.map(function(o){return o._area;}));
            //filter the data for only those ifl in the passed year
            let iflFilter = this.state.alldata.filter(function(item) {
                return (item.yr === yr && item.country === this.props.country);
            }, this);
            //convert the ifls to an array of codes to be able to filter the map
            let iflFilterArray = iflFilter.map((item) => { return item.ifl_id });
            //get the filter expressions to pass to the time series chart
            filterExpressions = [
                { layer: "Intact Forest 2013", expression: ["in", "IFL_ID"].concat(iflFilterArray) }
            ];
            var expression = ["match", ["get", "IFL_ID"]];
            iflFilter.forEach(function(row, index) {
                expression.push(row.ifl_id, "rgba(" + (138 + (Math.log((row._area*10)/maxArea)*255)) + ",135,0,0.5)");
            });
            expression.push("rgba(0,0,0,0)");
            //set the paint property
            this.props.map.setPaintProperty('Intact Forest 2013', "fill-color", expression);
            this.props.map.setPaintProperty('Intact Forest 2013', "fill-opacity", 0.6);
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
            {this.props.country} Intact Forest Landscapes logged in the last 16 years
          </div> : null }
          <React.Fragment>
            <TimeSeriesChart 
              width={400} 
              height={200} 
              data={this.state.data} 
              margin={{ top: 25, right: 15, bottom: 25, left: 15 }} {...this.props} 
              xdomain={this.state.xdomain} 
              xDataKey={'x'} 
              yDataKey={'y'} 
              yAxisLabel={'Number of intact forest landscapes logged'}
              getFilterExpressions={this.getFilterExpressions.bind(this)}
            />
            <CardText 
              style={{padding:'12px',fontSize:'13px'}}>{this.props.desc ? this.props.desc : "Move the mouse over the chart to filter by year."}
            </CardText>
          </React.Fragment>
        </Tab>                  
        <Tab 
          label="PA" 
          value="Province"
          disabled={true}
          buttonStyle={{height:'25px',padding:'3px 0px 3px 0px',backgroundColor:'#d0d0d0'}}
          style={{fontSize:'12px'}}
          />
     </Tabs>
        );
    }
}

export default IntactForestCountry;
