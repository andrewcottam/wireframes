import * as React from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import mapboxgl from 'mapbox-gl';

class PlanningUnits extends React.Component {
    componentDidMount() {
        this.props.getPlanningUnits();
        this.map = new mapboxgl.Map({
            container: this.mapContainer,
            style: 'mapbox://styles/blishten/cjg6jk8vg3tir2spd2eatu5fd', //north star + marine PAs in pacific
            center: [0, 0],
            zoom: 2,
            
        });
    }
    addLayerToMap(mapboxlayername) {
        if (this.map.getSource('blishten')){
            this.map.removeLayer('hexagons');
            this.map.removeSource('blishten');
        }
        //add the source for this layer
        this.map.addSource('blishten', {
            type: 'vector',
            url: "mapbox://blishten." + mapboxlayername
        });
        this.map.addLayer({
            'id': mapboxlayername,
            'type': "fill",
            'source': 'blishten',
            'source-layer': "hexagons",
            'paint': {
                'fill-color': '#f08',
                'fill-opacity': 0.4
            }
        });
    }
    getLatLngLikeFromWKT(wkt) {
        var parse = require('wellknown');
        let envelope = parse(wkt).coordinates[0];
        return [
            [envelope[0][0], envelope[0][1]],
            [envelope[2][0], envelope[2][1]]
        ];
    }
    changeItem(event, newValue) {
        //get the selected item
        let item = this.props.planningUnits[newValue];
        //zoom to the layer
        let envelope = this.getLatLngLikeFromWKT(item.envelope);
        this.map.fitBounds(envelope,{easing: function(num) { return 1; }});
        // this.map.setPitch(60);
        //add the layer to the map
        this.addLayerToMap(item.feature_class_name);
        //update the state in the owner
        this.props.changeItem(item.feature_class_name);
    }
    openNewPlanningUnitDialog() {
        this.props.openNewPlanningUnitDialog();
    }
    render() {
        return (
            <React.Fragment>
                <div className={'newPUDialogPane'}>
                    <div ref={el => this.mapContainer = el} className="absolute top right left bottom" style={{width:'500px',height:'300px', marginTop: '71px',marginLeft: '104px'}}/>
                    <SelectField onChange={this.changeItem.bind(this)} value={this.props.pu} style={{width:'420px'}} floatingLabelText="Select the planning units" floatingLabelFixed={true} style={{marginTop:'293px', width:'400px'}}>
                        {this.props.planningUnits.map((item)=>{return <MenuItem value={item.feature_class_name} primaryText={item.alias} />})}
                    </SelectField>
                    <RaisedButton 
                        label="New" 
                        onClick={this.openNewPlanningUnitDialog.bind(this)}
                        style={{minWidth: '66px', width: '30px',height: '23px', marginLeft: '20px',top:'408px',position: 'absolute'}}
                        labelStyle={{'fontSize':'12px','paddingLeft':'11px'}}
                        title="Create a new Planning Unit Grid"
                    />
                </div>
            </React.Fragment>
        );
    }
}

export default PlanningUnits;
