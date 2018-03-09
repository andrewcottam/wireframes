import * as React from 'react';
import { List, ListItem } from 'material-ui/List';

const STYLE_ID = 'cjefq7q90ivui2sn3ripbqq7b';

class ActionShowActionFundProposals extends React.Component {
  onClick(e) {
    this.props.map.setCenter([-73, 21]);
    this.props.map.zoomTo(5);
  }

  render() {
    return (
      <List>
        <ListItem primaryText={(this.props.map && this.props.map.style.stylesheet && this.props.map.style.stylesheet.id === STYLE_ID ? "Hide " : "Show ") + "Action Fund Proposals"} onClick={this.onClick.bind(this)}/>
      </List>
    );
  }
}

export default ActionShowActionFundProposals;
