import * as React from 'react';
import { Card, CardHeader, CardMedia, CardTitle, } from 'material-ui/Card';
import IntactForestIndicator from './IntactForestIndicator.js';
import TerrestrialCoverageIndicator from './TerrestrialCoverageIndicator.js';
import intactForest from './intactForest.png';

class IndicatorChart extends React.Component {
    configureMap(style, center, zoom) {
        this.props.map.setStyle(style);
        this.props.map.setCenter(center);
        this.props.map.zoomTo(zoom);
    }
    render() {
        var children;
        if (this.props.indicator) {
            switch (this.props.indicator.indicatorListItem.props.primaryText) {
                case 'Number of countries logging intact forests':
                    this.props.map.once("styledata", function() {
                        this.addLayer({
                            'id': 'GlobalForestWatch',
                            'type': 'raster',
                            'source': {
                                'type': 'raster',
                                "attribution": "Potapov P. et al. 2008. Mapping the World's Intact Forest Landscapes by Remote Sensing. Ecology and Society, 13 (2)",
                                'tiles': [
                                    // 'https://globalforestwatch-624153201.us-west-1.elb.amazonaws.com/arcgis/services/ForestCover_lossyear/ImageServer/WMSServer?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&width=256&height=256&layers=0'
                                    // 'https://50.18.182.188:6080/arcgis/services/ForestCover_lossyear/ImageServer/WMSServer?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&width=256&height=256&layers=0'
                                    'http://gis-treecover.wri.org/arcgis/services/ForestCover_lossyear/ImageServer/WMSServer?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&width=256&height=256&layers=0'
                                ],
                                'tileSize': 256
                            },
                            "layout": {
                                "visibility": "visible"
                            },
                            'maxzoom': 14,
                            'minzoom': 7,
                            'paint': {}
                        }, 'Intact Forest 2013');
                    });
                    this.props.map.setStyle('mapbox://styles/blishten/cj6f4n2j026qf2rnunkauikjm'); //png style
                    children = <IntactForestIndicator {...this.props}/>;
                    break;
                case 'Terrestrial protected area coverage':
                    this.configureMap('mapbox://styles/blishten/cjckavkjc9xui2snvo09hqpfs', [35.607, -6.273], 6); //terrestrial style
                    children = <TerrestrialCoverageIndicator {...this.props}/>;
                    break;
                case 'Marine protected area coverage':
                    this.configureMap('mapbox://styles/blishten/cjdvudwue0nvt2stb8vfiv03c', [39.554, -7.602], 7); //marine style
                    break;
                default:
            }
        }

        return (this.props.isOpen ?
            <Card style={{ position: 'absolute', left: '45px', width: '440px' }} containerStyle={{ boxShadow: "rgba(0, 0, 0, 0.25) 0px 14px 45px, rgba(0, 0, 0, 0.22) 0px 10px 18px" }}>
          <CardHeader title={this.props.indicator.policyListItem.props.primaryText} avatar={this.props.indicator.policyListItem.props.leftAvatarSrc} />
          <CardMedia overlay={
              <CardTitle 
                title={this.props.indicator.targetListItem.props.primaryText} 
                subtitle={this.props.indicator.targetListItem.props.secondaryText.length>50 ? this.props.indicator.targetListItem.props.secondaryText.substring(0,50) + ".." : this.props.indicator.targetListItem.props.secondaryText}
              />}
            title={this.props.indicator.targetListItem.props.secondaryText.length>50 ? this.props.indicator.targetListItem.props.secondaryText : null}>
            <img src={intactForest} alt="" />
          </CardMedia>
          <CardTitle 
            style={{padding:'0px'}}
            children={children}
          />
        </Card> : null
        );
    }
}
export default IndicatorChart;
