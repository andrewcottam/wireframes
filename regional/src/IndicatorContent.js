import mapboxgl from 'mapbox-gl';
import * as React from 'react';
import { CardHeader, CardMedia, CardTitle, } from 'material-ui/Card';
import IntactForestIndicator from './IntactForestIndicator.js';
import CoverageIndicator from './CoverageIndicator.js';
import CoverageIndicatorGlobal from './CoverageIndicatorGlobal.js';
import intactForest from './intactForest.png';
import IntactForestCountry from './IntactForestCountry.js';
import IntactForestLandscape from './IntactForestLandscape.js';
import SpeciesPopulation from './SpeciesPopulation.js';
import logo_g1 from './logo-g1.png';
import logo_r1 from './logo-r1.png';
import Avatar from 'material-ui/Avatar';
import { Route } from "react-router-dom";
import * as jsonp from 'jsonp';
import greenListLogo from './Green-List-logo-1.png';
let REST_SERVICES_ENDPOINT = "https://db-server-blishten.c9users.io/cgi-bin/services.py/"

class IndicatorContent extends React.Component {
    constructor(props) {
        super(props);
        this.mapurl = '';
    }
    onClick(e) {
        this.props.history.push({
            pathname: window.basepath + "i/1"
        });
    }
    configureMap(style, center, zoom) {
        if (this.mapurl !== style) {
            this.props.map.setStyle(style);
            this.mapurl = style;
        }
        if (center) this.props.map.flyTo({ center: center, zoom: zoom });
    }
    zoomToCountry(iso3) {
        jsonp(REST_SERVICES_ENDPOINT + "biopama/services/get_country_extent_by_iso?a_iso=" + iso3, this.parseGetExtent.bind(this));
    }
    zoomToIFL(ifl_id) {
        jsonp(REST_SERVICES_ENDPOINT + "biopama/services/get_ifl_extent?ifl_id=" + ifl_id, this.parseGetExtent.bind(this));
    }
    zoomToWDPA(wdpaid) {
        jsonp(REST_SERVICES_ENDPOINT + "biopama/services/get_wdpa_extent?wdpaid=" + wdpaid, this.parseGetExtent.bind(this));
    }

    parseGetExtent(err, response) {
        if (err) {
            //do something
        }
        else {
            this.props.map.fitBounds(eval(response.records[0].extent), {
                padding: { top: 10, bottom: 10, left: 490, right: 10 },
                linear: true
            });
        }
    }
    render() {
        var children, policyTitle, avatar, targetTitle, targetSubtitle, backgroundImage, country;
        if (this.props.map) {
            switch (Number(this.props.match.params.id)) {
                case 0:
                    this.configureMap('mapbox://styles/blishten/cjckavkjc9xui2snvo09hqpfs'); //terrestrial style
                    policyTitle = "Convention on Biological Diversity";
                    avatar = <Avatar src={logo_g1}/>;
                    targetTitle = "CBD Target 11";
                    targetSubtitle = "By 2020, at least 17 per cent of terrestrial and inland water areas, especially areas of particular importance for biodiversity and ecosystem services, are conserved through effectively and equitably managed, ecologically representative and well-connected systems of protected areas and other effective area-based conservation measures, and integrated into the wider landscape and seascape.";
                    country = this.props.match.params.iso3 ? this.props.match.params.iso3 : "TZA";
                    this.zoomToCountry(country);
                    children = <CoverageIndicator {...this.props} country={country} marine={false}/>;
                    backgroundImage = intactForest;
                    break;
                case 1:
                    this.configureMap('mapbox://styles/blishten/cjdvudwue0nvt2stb8vfiv03c'); //marine style 
                    policyTitle = "Convention on Biological Diversity";
                    avatar = <Avatar src={logo_g1}/>;
                    targetTitle = "CBD Target 11";
                    targetSubtitle = "By 2020, at least 10 per cent of coastal and marine areas, especially areas of particular importance for biodiversity and ecosystem services, are conserved through effectively and equitably managed, ecologically representative and well-connected systems of protected areas and other effective area-based conservation measures, and integrated into the wider landscape and seascape.";
                    country = this.props.match.params.iso3 ? this.props.match.params.iso3 : "TZA";
                    this.zoomToCountry(country);
                    children = <CoverageIndicator {...this.props} country={country} marine={true}/>;
                    backgroundImage = intactForest;
                    break;
                case 2:
                    this.configureMap('mapbox://styles/blishten/cj6f4n2j026qf2rnunkauikjm', [162, -13], 4);
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
                            'minzoom': 4,
                            'paint': {}
                        }, 'Intact Forest 2013');
                    });
                    policyTitle = "Framework for Nature Conservation and Protected Areas in the Pacific Islands Region";
                    avatar = <Avatar src={logo_r1}/>;
                    targetTitle = "Objective 3";
                    targetSubtitle = "Identify, conserve, sustainably manage and restore priority sites, habitats and ecosystems, including cultural sites";
                    let region = this.props.match.params.iso3 ? this.props.match.params.iso3 : "Pacific";
                    children = <IntactForestIndicator {...this.props} indicatorTitle="Number of countries logging intact forests" desc="This indicator shows the number of countries that have logged Intact Forest Areas during the last 25 years." region={region}/>;
                    backgroundImage = intactForest;
                    break;
                case 13:
                    this.configureMap('mapbox://styles/blishten/cj6f4n2j026qf2rnunkauikjm'); //country intact forest landscapes indicator
                    policyTitle = "Framework for Nature Conservation and Protected Areas in the Pacific Islands Region";
                    avatar = <Avatar src={logo_r1}/>;
                    targetTitle = "Objective 3";
                    targetSubtitle = "Identify, conserve, sustainably manage and restore priority sites, habitats and ecosystems, including cultural sites";
                    country = this.props.match.params.iso3 ? this.props.match.params.iso3 : "TZA";
                    this.zoomToCountry(country);
                    children = <IntactForestCountry {...this.props} country={country} marine={true}/>;
                    backgroundImage = intactForest;
                    break;
                case 14:
                    this.configureMap('mapbox://styles/blishten/cj6f4n2j026qf2rnunkauikjm'); //individual ifl indicator
                    policyTitle = "Framework for Nature Conservation and Protected Areas in the Pacific Islands Region";
                    avatar = <Avatar src={logo_r1}/>;
                    targetTitle = "Objective 3";
                    targetSubtitle = "Identify, conserve, sustainably manage and restore priority sites, habitats and ecosystems, including cultural sites";
                    let ifl_id = this.props.match.params.iso3 ? this.props.match.params.iso3 : "TZA"; // actually an ifl_id
                    this.zoomToIFL(ifl_id);
                    children = <IntactForestLandscape {...this.props} ifl_id={ifl_id}/>;
                    backgroundImage = intactForest;
                    break;
                case 15:
                    this.configureMap('mapbox://styles/blishten/cjht9a4i20ya92ro5yu73ciqd'); //local level
                    policyTitle = "O Le Pupū Puē National Park Management Plan";
                    avatar = <Avatar src={greenListLogo}/>;
                    targetTitle = "Maintain biodiversity";
                    targetSubtitle = "";
                    let wdpaid = this.props.match.params.iso3 ? this.props.match.params.iso3 : "TZA"; // actually an ifl_id
                    this.zoomToWDPA(wdpaid);
                    children = <SpeciesPopulation {...this.props}/>;
                    backgroundImage = intactForest;
                    var popup = new mapboxgl.Popup({ closeOnClick: false })
                        .setLngLat([-171.733, -13.982])
                        .setHTML('<div><img style="width:200px;height:150px" src="https://theodora.com/wfb/photos/samoa/o_le_pupu-pue_national_park_upolu_samoa_photo_samoa.jpg"><div>© Samoa Tourism Authority</div></div>')
                        .addTo(this.props.map);
                    break;
                case 11:
                    this.configureMap('mapbox://styles/blishten/cjhkj85g106fe2so2r7e4kvkb', [0, 0], 4); //global view
                    policyTitle = "Convention on Biological Diversity";
                    avatar = <Avatar src={logo_g1}/>;
                    targetTitle = "CBD Target 11";
                    targetSubtitle = "By 2020, at least 17 per cent of terrestrial and inland water areas, especially areas of particular importance for biodiversity and ecosystem services, are conserved through effectively and equitably managed, ecologically representative and well-connected systems of protected areas and other effective area-based conservation measures, and integrated into the wider landscape and seascape.";
                    backgroundImage = intactForest;
                    children = <CoverageIndicatorGlobal {...this.props} country={country} terrestrial={true}/>;
                    break;
                case 12:
                    this.configureMap('mapbox://styles/blishten/cjhkj85g106fe2so2r7e4kvkb', [0, 0], 4); //global view
                    policyTitle = "Convention on Biological Diversity";
                    avatar = <Avatar src={logo_g1}/>;
                    targetTitle = "CBD Target 11";
                    targetSubtitle = "By 2020, at least 10 per cent of coastal and marine areas, especially areas of particular importance for biodiversity and ecosystem services, are conserved through effectively and equitably managed, ecologically representative and well-connected systems of protected areas and other effective area-based conservation measures, and integrated into the wider landscape and seascape.";
                    backgroundImage = intactForest;
                    children = <CoverageIndicatorGlobal {...this.props} country={country} terrestrial={false}/>;
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
