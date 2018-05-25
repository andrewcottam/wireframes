import * as React from 'react';
import { ListItem } from 'material-ui/List';

class IndicatorListItem extends React.Component {
    indicatorSelected(e) {
        this.props.onClick(this);
        let path = this.props.iso3 ? "indicator/" + this.props.id + "/" + this.props.iso3 : "indicator/" + this.props.id;
        this.props.history.push({
            pathname: window.basepath + path
        });
    }
    render() {
        return (
            <ListItem primaryText={this.props.primaryText} secondaryText = {this.props.secondaryText} title={this.props.secondaryText} onClick={this.indicatorSelected.bind(this)}/>
        );
    }
}

export default IndicatorListItem;
