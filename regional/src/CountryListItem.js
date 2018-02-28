import * as React from 'react';
import { ListItem } from 'material-ui/List';

class CountryListItem extends React.Component {
  drillCountry() {
    this.props.drillCountry({ countryListItem: this });
  }
  render() {
    return (
      <React.Fragment>
        <ListItem primaryText={this.props.primaryText} secondaryText={this.props.secondaryText} leftAvatar={this.props.leftAvatar} onClick={this.drillCountry.bind(this)} innerDivStyle={{padding:'16px 16px 16px 67px'}}/> 
      </React.Fragment>
    );
  }
}
export default CountryListItem;
