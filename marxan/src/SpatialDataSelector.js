import React from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

class SpatialDataSelector extends React.Component {
    changeTileset = (event, index, value) => {
        this.props.changeTileset(this.props.tilesets[index].id);
    };

    render() {
        let c = this.props.tilesets.map((tileset) => {
            return (<MenuItem value={tileset.id} key={tileset.name} primaryText={tileset.name} tileset={tileset}/>);
        });
        return (
            <div>
                <SelectField floatingLabelText="Mapbox layer" children={c} maxHeight={200} style={{width:'335px','marginLeft':'10px','marginBottom':'22px'}} menuItemStyle={{fontSize:'13px'}} labelStyle={{fontSize:'13px'}} value={this.props.value} onChange={this.changeTileset.bind(this)}>
                </SelectField>
            </div>);
    }
}

export default SpatialDataSelector;
