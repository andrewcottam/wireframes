import React from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

class ColorSelector extends React.Component {
    handleChange(event, index, value) {
        this.props.changeValue(value);
    }
    selectionRenderer() {
        let c = this.getSwatch(this.props.property, true);
        return c;
    }
    getSwatch(item, disableHighlight) {
        let numClasses, divWidth, colorDivs, numClassesArray, colorScheme, colorSchemeLength, properties, numbers, classesToShow;
        //get the number of classes the user currently has selected
        numClasses = this.props.brew.getNumClasses();
        //get the color scheme
        colorScheme = this.props.brew.colorSchemes[item];
        //get the names of the properties for the colorScheme
        properties = Object.keys(colorScheme).filter(function(item) { return (item !== 'properties'); });
        //get them as numbers
        numbers = properties.map((item) => { return Number(item) });
        //get the maximum number of colors in this scheme
        colorSchemeLength = numbers.reduce(function(a, b) {
            return Math.max(a, b);
        });
        //get the number of colors to show as an array
        numClassesArray = (numClasses <= colorSchemeLength) ? Array.apply(null, { length: numClasses }).map(Number.call, Number) : Array.apply(null, { length: colorSchemeLength }).map(Number.call, Number);
        classesToShow = numClassesArray.length;
        divWidth = 112 / classesToShow;
        colorDivs = numClassesArray.map((item) => {
            return <div style={{backgroundColor: colorScheme[classesToShow][item], width: divWidth, height:'16px', display: 'inline-block'}}/>;
        });
        let borderColor = ((item === this.props.property) && !disableHighlight) ?  'rgb(255, 64, 129)'  : 'lightgray';
        colorDivs = <div style={{display:'inline-flex', marginTop:'12px', border:'1px solid ' + borderColor}}>{colorDivs}</div>;
        return colorDivs;
    }
    render() {
        let primaryText;
        let c = this.props.values.map(function(item) {
            (item !== 'opacity') ?  primaryText = '' : primaryText = "Opacity";
            if (item !== 'opacity') c = this.getSwatch(item, false);
            return <MenuItem value={item} primaryText={primaryText} key={item} children={c}/>;
        }, this);
        return (
            <SelectField selectionRenderer={this.selectionRenderer.bind(this)} menuItemStyle={{fontSize:'13px'}} labelStyle={{fontSize:'13px'}} listStyle={{fontSize:'13px'}} style={{width:'150px', margin: '0px 20px'}} autoWidth={true} floatingLabelText={this.props.floatingLabelText} floatingLabelFixed={true} children={c} onChange={this.handleChange.bind(this)} value={this.props.property}/>
        );
    }
}

export default ColorSelector;
