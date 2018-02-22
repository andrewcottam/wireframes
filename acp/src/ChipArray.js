import React from 'react';
import Chip from 'material-ui/Chip';

export default class ChipArray extends React.Component {

  constructor(props) {
    super(props);
    this.styles = {
      chip: {
        margin: 4,
      },
      wrapper: {
        display: 'flex',
        flexWrap: 'wrap',
      },
    };
  }

  renderChip(data) {
    return (
      <Chip
        key={data.key}
        onRequestDelete={() => this.props.deleteChip(data)}
        style={this.styles.chip}
      >
        {data.label}
      </Chip>
    );
  }

  render() {
    return (
      <div style={this.styles.wrapper}>
        {this.props.chipData.map(this.renderChip, this)}
      </div>
    );
  }
}