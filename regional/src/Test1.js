import * as React from 'react';

class Test1 extends React.Component {
    onClick(e) {
        this.props.history.push({
            pathname: window.basepath + "i/1"
        });
    }
    render() {
        return (
            <div onClick={this.onClick.bind(this)}>wibble1</div>
        );
    }
}

export default Test1;
