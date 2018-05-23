import * as React from 'react';
import { CardHeader, CardMedia, CardTitle, } from 'material-ui/Card';
import IntactForestIndicator from './IntactForestIndicator.js';
import TerrestrialCoverageIndicator from './TerrestrialCoverageIndicator.js';
import intactForest from './intactForest.png';
import logo_g1 from './logo-g1.png';
import logo_r1 from './logo-r1.png';
import Avatar from 'material-ui/Avatar';
import { Route } from "react-router-dom";

class IndicatorContent extends React.Component {
    onClick(e) {
        this.props.history.push({
            pathname: window.basepath + "i/1"
        });
    }
    configureMap(style, center, zoom) {
        this.props.map.setStyle(style);
        this.props.map.flyTo({center: center,zoom: zoom});
    }
    render() {
        var children, policyTitle, avatar, targetTitle, targetSubtitle, backgroundImage;
        if (this.props.map) {
            switch (Number(this.props.match.params.id)) {
                case 0:             
                    this.configureMap('mapbox://styles/blishten/cjckavkjc9xui2snvo09hqpfs', [35.607, -6.273], 6); //terrestrial style
                    policyTitle = "Convention on Biological Diversity";
                    avatar = <Avatar src={logo_g1}/>;
                    targetTitle = "CBD Target 11";
                    targetSubtitle = "By 2020, at least 17 per cent of terrestrial and inland water areas, especially areas of particular importance for biodiversity and ecosystem services, are conserved through effectively and equitably managed, ecologically representative and well-connected systems of protected areas and other effective area-based conservation measures and integrated into the wider landscape and seascape.";
                    let country = this.props.match.params.iso3 ? this.props.match.params.iso3 : "TZA";
                    children = <TerrestrialCoverageIndicator {...this.props} country={country}/>;
                    backgroundImage = intactForest;
                    break;
                case 1:
                    this.configureMap('mapbox://styles/blishten/cjdvudwue0nvt2stb8vfiv03c', [39.554, -7.602], 7); //marine style
                    policyTitle = "Convention on Biological Diversity";
                    avatar = <Avatar src={logo_g1}/>;
                    targetTitle = "CBD Target 11";
                    targetSubtitle = "By 2020, at least 10 per cent of coastal and marine areas, especially areas of particular importance for biodiversity and ecosystem services, are conserved through effectively and equitably managed, ecologically representative and well-connected systems of protected areas and other effective area-based conservation measures, and integrated into the wider landscape and seascape.";
                    backgroundImage = intactForest;
                    break;
                case 2:
                    this.configureMap('mapbox://styles/blishten/cj6f4n2j026qf2rnunkauikjm', [162,-13], 4);
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
                                    'https://gis-treecover.wri.org/arcgis/services/ForestCover_lossyear/ImageServer/WMSServer?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&width=256&height=256&layers=0'
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
                    policyTitle = "Framework for Nature Conservation and Protected Areas in the Pacific Islands Region";
                    avatar = <Avatar src={logo_r1}/>;
                    targetTitle = "Objective 3";
                    targetSubtitle = "Identify, conserve, sustainably manage and restore priority sites, habitats and ecosystems, including cultural sites";
                    children = <IntactForestIndicator {...this.props} indicatorTitle="Number of countries logging intact forests" desc="This indicator shows the number of countries that have logged Intact Forest Areas during the last 25 years."/>;
                    backgroundImage = intactForest;
                    break;
                default:
            }
            return (
                <React.Fragment>
                    <CardHeader title={policyTitle} avatar={avatar} onClick={this.onClick.bind(this)} />
                    <CardMedia overlay={
                        <CardTitle 
                        title={targetTitle} 
                        subtitle={targetSubtitle.length>50 ? targetSubtitle.substring(0,50) + ".." : targetSubtitle}
                        />}
                        title={targetSubtitle.length>50 ? targetSubtitle : null}>
                        <img src={backgroundImage} alt="" />
                    </CardMedia>
                    <CardTitle  style={{padding:'0px'}} children={children} />
                </React.Fragment>
            );
        }
        else {
            return null;
        }
    }
}

export default IndicatorContent;
