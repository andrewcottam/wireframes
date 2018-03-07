import React, { Component } from 'react';
import { Layer, Feature } from "react-mapbox-gl";

class FeatureLayer extends Component {
    render() {
        return (
            <Layer 
                type="symbol" 
                id="marker" 
                layout={{"icon-allow-overlap": true, "icon-image": "circle-stroked-15","visibility":this.props.visible ? "visible" : "none" }} 
                paint={{"icon-color": "#ffff00"}}>
              <Feature coordinates={[-73,21]}/>
              <Feature coordinates={[-74,21]}/>
            </Layer>
        );
    }
}

export default FeatureLayer;