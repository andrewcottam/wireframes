import * as React from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

class FilterItem extends React.Component {
    constructor(props) {
        super(props);
        let vals = (this.props.vals ? this.props.vals : []);
        this.state = {
            values: vals,
        };
    }


    handleChange = (event, index, values) => {
        this.props.onChange(event, index, values);
    };

    menuItems(values) {
        return this.props.names.map((name) => (
            <MenuItem
        key={name}
        checked={values && values.indexOf(name) > -1}
        value={name}
        primaryText={name}
      />
        ));
    }

    render() {
        const { values } = this.state;
        return (
            <SelectField
        floatingLabelText={this.props.title}
        multiple={true}
        hintText="Select an item"
        value={this.props.value}
        onChange={this.handleChange}
        style={{width:'200px',padding:'10px'}}
        autoWidth={true}
      >
        {this.menuItems(values)}
      </SelectField>
        );
    }
}

export default FilterItem;
