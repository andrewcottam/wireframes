import * as React from 'react';

class GroupPanel extends React.Component {
    render() {
        let v = (this.props.open ? this.props.children : null);
        return <React.Fragment>{v}</React.Fragment>;
    }
}

export default GroupPanel;
