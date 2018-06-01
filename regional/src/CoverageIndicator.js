import * as React from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';
import TimeSeriesChart from './TimeSeriesChart.js';
import { CardText } from 'material-ui/Card';
import * as jsonp from 'jsonp'; 

class CoverageIndicator extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: [], xdomain: [] };
  }
  componentDidMount() {
    let domain = (this.props.marine) ? "marine" : "terrestrial";
    let ENDPOINT = "https://db-server-blishten.c9users.io/cgi-bin/services.py/biopama/services/get_wdpa_" + domain + "_coverage_statistics?iso3code=" + this.props.country;
    jsonp(ENDPOINT, this.parseData.bind(this)); //get the data from the server and parse it
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    let domain = (this.props.marine) ? "marine" : "terrestrial";
    if ((prevProps.country !== this.props.country)||(prevProps.marine !== this.props.marine)){
      let ENDPOINT = "https://db-server-blishten.c9users.io/cgi-bin/services.py/biopama/services/get_wdpa_" + domain + "_coverage_statistics?iso3code=" + this.props.country;
      jsonp(ENDPOINT, this.parseData.bind(this)); //get the data from the server and parse it
    }
  }
  parseData(err, response) {
    if (err) throw err;
    let countryArea = response.records && response.records[0] && response.records[0].country_area;
    let allyears = response.records.map((item) => {
      return { x: item.yr, cum_area: item.cum_area, percent: (item.cum_area / (countryArea / 100000000)), threshold: 17 };
    });
    let xstart = (allyears[0].x === 0) ? allyears[1].x : allyears[0].x;
    let xend = allyears[allyears.length - 1].x;
    allyears = (allyears[0].x === 0) ? allyears.slice(1) : allyears;
    this.setState({ data: allyears, xdomain: [xstart, xend] });
  }
  getFilterExpressions(yr) {
    let filterExpressions;
    if (this.state.data) {
      if (this.props.marine) {
        filterExpressions = [
          {
            layer: "marine-pas",
            expression: ["all", ["<", "STATUS_YR", yr],
              ["==", "PARENT_ISO", this.props.country],
              ["!=", "DESIG", "UNESCO-MAB Biosphere Reserve"],
              ["!=", "STATUS", "Proposed"]
            ]
          },
          {
            layer: "marine-pas-active",
            expression: ["all", ["==", "STATUS_YR", yr],
              ["==", "PARENT_ISO", this.props.country],
              ["!=", "DESIG", "UNESCO-MAB Biosphere Reserve"],
              ["!=", "STATUS", "Proposed"]
            ]
          },
          {
            layer: "marine-pas-labels",
            expression: ["all", ["==", "STATUS_YR", yr],
              ["==", "PARENT_ISO", this.props.country],
              ["!=", "DESIG", "UNESCO-MAB Biosphere Reserve"]
            ]
          }
        ];
      }
      else {
        filterExpressions = [{
            layer: "terrestrial-pas",
            expression: ["all", ["<", "STATUS_YR", yr],
              ["==", "PARENT_ISO", this.props.country],
              ["!=", "DESIG", "UNESCO-MAB Biosphere Reserve"],
              ["!=", "STATUS", "Proposed"]
            ]
          },
          {
            layer: "terrestrial-pas-active",
            expression: ["all", ["==", "STATUS_YR", yr],
              ["==", "PARENT_ISO", this.props.country],
              ["!=", "DESIG", "UNESCO-MAB Biosphere Reserve"],
              ["!=", "STATUS", "Proposed"]
            ]
          },
          {
            layer: "terrestrial-pas-labels",
            expression: ["all", ["==", "STATUS_YR", yr],
              ["==", "PARENT_ISO", this.props.country],
              ["!=", "DESIG", "UNESCO-MAB Biosphere Reserve"],
              ["!=", "STATUS", "Proposed"]
            ]
          },
          {
            layer: "marine-pas",
            expression: ["all", ["<", "STATUS_YR", -1],
              ["==", "PARENT_ISO", this.props.country],
              ["!=", "DESIG", "UNESCO-MAB Biosphere Reserve"],
              ["!=", "STATUS", "Proposed"]
            ]
          },
          {
            layer: "marine-pas-active",
            expression: ["all", ["==", "STATUS_YR", -1],
              ["==", "PARENT_ISO", this.props.country],
              ["!=", "DESIG", "UNESCO-MAB Biosphere Reserve"],
              ["!=", "STATUS", "Proposed"]
            ]
          },
          {
            layer: "marine-pas-labels",
            expression: ["all", ["==", "STATUS_YR", -1],
              ["==", "PARENT_ISO", this.props.country],
              ["!=", "DESIG", "UNESCO-MAB Biosphere Reserve"]
            ]
          }
        ];
      }
      return filterExpressions;
    }
    else {
      return null;
    }
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
            {this.props.country} {this.props.marine ? "marine" : "terrestrial"}  protected area coverage
          </div> : null }
          <React.Fragment>
            <TimeSeriesChart 
              width={400} 
              height={200} 
              data={this.state.data} 
              margin={{ top: 25, right: 15, bottom: 25, left: 15 }} {...this.props} 
              xdomain={this.state.xdomain} 
              xDataKey={'x'} 
              yDataKey={'percent'} 
              yAxisLabel={'% protected'}
              scale={'linear'}
              getFilterExpressions={this.getFilterExpressions.bind(this)}
            />
            <CardText 
              style={{padding:'12px',fontSize:'13px'}}>{this.props.desc ? this.props.desc : "Move the mouse over the chart to filter by year."}
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

export default CoverageIndicator;
