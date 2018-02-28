import * as React from 'react';
import { ListItem } from 'material-ui/List';

class ProvinceListItem extends React.Component {
  drillProvince() {
    this.props.drillProvince({ provinceListItem: this });
  }
  render() {
    return (
      <React.Fragment>
        <ListItem primaryText={this.props.primaryText} onClick={this.drillProvince.bind(this)} innerDivStyle={{padding:'3px 10px 3px 20px'}}/> 
      </React.Fragment>
    );
  }
}
export default ProvinceListItem;