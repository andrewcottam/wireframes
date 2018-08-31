import * as React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import mapboxgl from 'mapbox-gl';
import SelectFieldMapboxLayer from '../SelectFieldMapboxLayer';

class PlanningUnits extends React.Component {
    componentDidMount() {
        this.props.getPlanningUnits();
        this.map = new mapboxgl.Map({
            container: this.mapContainer,
            style: 'mapbox://styles/blishten/cjg6jk8vg3tir2spd2eatu5fd', //north star + marine PAs in pacific
            center: [0, 0],
            zoom: 2
        });
    }
    openNewPlanningUnitDialog() {
        this.props.openNewPlanningUnitDialog();
    }
    render() {
        return (
            <React.Fragment>
                <div className={'newPUDialogPane'}>
                    <div ref={el => this.mapContainer = el} className="absolute top right left bottom" style={{width:'500px',height:'300px', marginTop: '71px',marginLeft: '25px'}}/>
                    <div style={{'paddingTop': '27px'}}>
                        <SelectFieldMapboxLayer selectedValue={this.props.pu} map={this.map} mapboxUser={'blishten'} items={this.props.planningUnitGrids} changeItem={this.props.changeItem}/>
                        <RaisedButton 
                            label="New" 
                            onClick={this.openNewPlanningUnitDialog.bind(this)}
                            style={{minWidth: '66px', width: '30px',height: '23px', marginLeft: '20px',top:'434px',position:'absolute'}}
                            labelStyle={{'fontSize':'12px','paddingLeft':'11px'}}
                            title="Create a new Planning Unit Grid"
                        />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default PlanningUnits;
