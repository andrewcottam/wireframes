import * as React from 'react';
import { List, ListItem } from 'material-ui/List';

const STYLE_ID = 'cjefq7q90ivui2sn3ripbqq7b';

class ActionViewActionFundProposals extends React.Component {
  constructor(props) {
    super(props);
    this.state = { previousStylesheetID: null };
  }
  showActionFundProposals() {
    this.setState({ previousStylesheetID: this.props.map.style.stylesheet.id });
    var newStyle = (this.props.map.style.stylesheet.id === STYLE_ID) ? this.state.previousStylesheetID && this.props.map.style.stylesheet.id : STYLE_ID;
    this.props.map.setCenter([-73, 21]);
    this.props.map.zoomTo(5);
    this.props.map.setStyle("mapbox://styles/blishten/" + newStyle);
  }

  render() {
    return (
      <List>
        <ListItem primaryText={(this.props.map && this.props.map.style.stylesheet && this.props.map.style.stylesheet.id === STYLE_ID ? "Hide " : "Show ") + "Action Fund Proposals"} onClick={this.showActionFundProposals.bind(this)}/>
      </List>
    );
  }
}

export default ActionViewActionFundProposals;
