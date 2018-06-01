import mapboxgl from 'mapbox-gl';
import * as React from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';
import TimeSeriesChart from './TimeSeriesChart.js';
import { CardText } from 'material-ui/Card';
import * as jsonp from 'jsonp';

class SpeciesPopulation extends React.Component {
    mouseMove(e) {
        if (this.popup) {
            var features = this.props.map.queryRenderedFeatures(e.point);
            if ((features.length) && (features[0].layer.id != "Water")) {
                var html = this.getPopupText(this, features);
                this.popup.setLngLat(e.lngLat);
                this.popup.setHTML(html)
            }
            else {
                // hideCallout(e);
            }
        }
        else {
            this.createPopup();
        }
    }
    createPopup() {
        this.popup = new mapboxgl.Popup({ closeOnClick: false, offset:[120,0]})
            .setLngLat([-171.933, -13.982])
            .setHTML('<div>Wibble</div>')
            .addTo(this.props.map);
    }

    getPopupText(me, features) {
        var feature = features[0];
        var color;
        if (feature.layer['source-layer'] == 'wdpa') {
            color = feature.properties.MARINE == "0" ? "rgba(99,148,69, 0.2)" : "rgba(63,127,191, 0.2)";
        }
        else {
            // color = feature.layer.paint.hasOwnProperty("fill-color") ? feature.layer.paint["fill-color"] : feature.layer.paint["line-color"];
        }
        var header = "<div class='layer' style='background-color:" + color + "'><i class='fa fa-map-marker' aria-hidden='true'></i>" + feature.layer.id + "</div>";
        var properties = [];
        var propertyNames = [];
        var text = "";
        var omitProps = ["sort_rank", "kind_detail", "id:right", "id:left", "source","Shape_Area","Shape_Leng", "area", "min_zoom", "id", "osm_relation", "tier", "boundary", "ISO3"]; //exclude the following properties from appearing - these are Mapzen specific
        for (var prop in feature.properties) { //iterate through the properties of the OSM feature and populate the properties that are valid and that we want to show
            if (omitProps.indexOf(prop) == -1) { //omit certain system properties
                if (Object.values(properties).indexOf(feature.properties[prop]) == -1) { //check that we havent already got the value
                    properties[prop] = feature.properties[prop];
                    propertyNames.push(prop);
                }
            }
        }
        //order the property names
        me.moveElementToStart(propertyNames, "NAME");
        me.moveElementToStart(propertyNames, "name");
        me.moveElementToStart(propertyNames, "kind");
        if (propertyNames.length > 0) {
            text = "<table class='popupTable'>";
            for (let prop of propertyNames) { //iterate through the properties that we want to show and build the html for the popup
                var value = properties[prop]; //get the value
                if (typeof(value) == "string") { //check the value is a string
                    value = value.replace("_", " "); //replace any underscores
                }
                switch (prop) {
                    case "NAME":
                    case "name":
                        text += "<tr><td colspan='2' class='name'>" + value + "</td></tr>";
                        break;
                    default:
                        if (typeof(value) == "string") {
                            value = me.toSentenceCase(value); //Sentence case
                        }
                        text += "<tr><td class='propName'>" + me.toSentenceCase(prop) + "</td><td class='propValue'>" + value + "</td></tr>"; //write the html text with the new value in
                        break;
                }
            }
            text += "</table>";
        }
        return header + text;
    }

    moveElementToStart(array, propertyName) {
        var pos = array.indexOf(propertyName);
        if (pos) {
            array.unshift(array[pos]);
            array.splice(pos + 1, 1);
        }
        return array;
    }

    toSentenceCase(text) {
        return text.substr(0, 1).toUpperCase() + text.substr(1);
    }

    componentDidMount() {
        this.props.map.on("mousemove", this.mouseMove.bind(this));
    }
    componentWillUnmount() {
        this.props.map.off("mousemove", this.mouseMove.bind(this));
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
              <div
                style={{padding:'12px',fontSize:'19px'}}>
                Ramsar Species Assessment
              </div>
            <TimeSeriesChart 
              width={400} 
              height={200} 
              data={[]} 
              margin={{ top: 25, right: 15, bottom: 25, left: 15 }} {...this.props} 
              xDataKey={'x'} 
              yDataKey={'y'} 
              yAxisLabel={'Population'}
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

export default SpeciesPopulation;
