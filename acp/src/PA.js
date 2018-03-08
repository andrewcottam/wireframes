import * as React from 'react';
import Header from './Header.js';

class PA extends React.Component {
    render() {
        return (
          <React.Fragment>
            <Header title={this.props.match.params.pa + " Summary"}/>
          </React.Fragment>
        );
    }
}

export default PA;
