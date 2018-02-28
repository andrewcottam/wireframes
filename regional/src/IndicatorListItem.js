import * as React from 'react';
import { ListItem } from 'material-ui/List';

class IndicatorListItem extends React.Component {
    indicatorSelected(e) {
        this.props.onClick(this);
    }
    render() {
        return (
            <React.Fragment>
                <ListItem primaryText={this.props.primaryText} secondaryText = {this.props.secondaryText} title={this.props.secondaryText} onClick={this.indicatorSelected.bind(this)}/>
            </React.Fragment>
        );
    }
}

export default IndicatorListItem;
